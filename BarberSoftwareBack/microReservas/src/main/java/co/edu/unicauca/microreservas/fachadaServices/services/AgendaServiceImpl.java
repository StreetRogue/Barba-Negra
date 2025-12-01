package co.edu.unicauca.microreservas.fachadaServices.services;


import co.edu.unicauca.microreservas.capaAccesoDatos.models.AgendaDiariaEntity;
import co.edu.unicauca.microreservas.capaAccesoDatos.models.EstadoReservaEnum;
import co.edu.unicauca.microreservas.capaAccesoDatos.models.ReservaEntity;
import co.edu.unicauca.microreservas.capaAccesoDatos.repositories.AgendaDiariaRepository;
import co.edu.unicauca.microreservas.fachadaServices.DTO.BarberoServicioDTO;
import co.edu.unicauca.microreservas.fachadaServices.DTO.HorarioExternoDTO;
import co.edu.unicauca.microreservas.fachadaServices.DTO.ServicioExternoDTO;
import co.edu.unicauca.microreservas.fachadaServices.DTO.SlotDTORespuesta;
import co.edu.unicauca.microreservas.infra.BarberoClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AgendaServiceImpl implements IAgendaService {

    private final AgendaDiariaRepository agendaRepository;
    private final BarberoClient barberoClient;

    public AgendaServiceImpl(
            AgendaDiariaRepository agendaRepository,
            BarberoClient barberoClient
    ){
        this.agendaRepository = agendaRepository;
        this.barberoClient = barberoClient;
    }

    // TIEMPO DE BUFFER (5 Minutos de limpieza entre citas)
    private static final int BUFFER_MINUTOS = 5;

    @Override
    @Transactional(readOnly = true)
    public List<SlotDTORespuesta> generarSlots(Integer idBarbero, Integer idServicio, LocalDate fecha) {
        List<SlotDTORespuesta> slots = new ArrayList<>();

        // PASO 0: Validar Relación
        List<BarberoServicioDTO> serviciosDelBarbero = barberoClient.obtenerServiciosPorBarbero(idBarbero);
        boolean ofreceServicio = serviciosDelBarbero.stream()
                .anyMatch(bs -> bs.getServicioId().equals(idServicio));
        if (!ofreceServicio) {
            throw new RuntimeException("BAD_REQUEST");
        }

        // PASO 1: Obtener Duración
        ServicioExternoDTO servicio = barberoClient.obtenerServicio(idServicio);
        if (servicio == null) {
            throw new RuntimeException("NOT_FOUND");
        }
        int duracionMinutos = servicio.getDuracionMinutos();


        // PASO 2: Obtener Horario
        List<HorarioExternoDTO> horarios = barberoClient.obtenerHorarios(idBarbero);
        if (horarios == null || horarios.isEmpty()) {
            throw new RuntimeException("NOT_FOUND");
        }

        int diaSemana = fecha.getDayOfWeek().getValue();
        HorarioExternoDTO horarioDia = horarios.stream()
                .filter(h -> h.getDiaSemana() == diaSemana)
                .findFirst()
                .orElse(null);

        if (horarioDia == null || Boolean.TRUE.equals(horarioDia.getEsDiaLibre())) {
            return slots;
        }

        // PASO 3: Reservas Existentes
        Optional<AgendaDiariaEntity> agendaOpt = agendaRepository.findByIdBarberoAndFecha(idBarbero, fecha);
        List<ReservaEntity> reservasOcupadas = agendaOpt.map(AgendaDiariaEntity::getReservas).orElse(new ArrayList<>());

        // PASO 4: Algoritmo con BUFFER
        LocalTime actual = horarioDia.getHoraInicio();
        LocalTime finJornada = horarioDia.getHoraFin();

        // Mientras quepa el servicio (sin contar el buffer final obligatoriamente para el último turno)
        while (actual.plusMinutes(duracionMinutos).isBefore(finJornada) ||
                actual.plusMinutes(duracionMinutos).equals(finJornada)) {

            // A. Fin para el cliente (Duración Real)
            LocalTime finSlotCliente = actual.plusMinutes(duracionMinutos);

            boolean ocupado = false;

            // B. Verificar colisión
            for (ReservaEntity reserva : reservasOcupadas) {
                if (reserva.getEstado() != EstadoReservaEnum.CANCELADA) {
                    LocalTime resInicio = reserva.getHoraInicio().toLocalTime();
                    LocalTime resFin = reserva.getHoraFin().toLocalTime();

                    // Si se cruzan los tiempos
                    if (actual.isBefore(resFin) && finSlotCliente.isAfter(resInicio)) {
                        ocupado = true;
                        break;
                    }
                }
            }

            slots.add(SlotDTORespuesta.builder()
                    .horaInicio(actual)
                    .horaFin(finSlotCliente) // Mostramos la hora real de fin al cliente
                    .disponible(!ocupado)
                    .mensaje(ocupado ? "Ocupado" : "Disponible")
                    .build());

            // C. AVANZAR RELOJ: Aquí sumamos el BUFFER
            // El siguiente slot empieza después de (Servicio + Limpieza)
            actual = actual.plusMinutes(duracionMinutos + BUFFER_MINUTOS);
        }

        return slots;
    }
}