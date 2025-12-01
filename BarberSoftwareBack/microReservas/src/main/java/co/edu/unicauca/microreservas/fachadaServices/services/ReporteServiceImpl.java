package co.edu.unicauca.microreservas.fachadaServices.services;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.EstadoReservaEnum;
import co.edu.unicauca.microreservas.capaAccesoDatos.models.HistorialReservaEntity;
import co.edu.unicauca.microreservas.capaAccesoDatos.models.ReservaEntity;
import co.edu.unicauca.microreservas.capaAccesoDatos.repositories.HistorialReservaRepository;
import co.edu.unicauca.microreservas.capaAccesoDatos.repositories.ReservaRepository;
import co.edu.unicauca.microreservas.fachadaServices.DTO.HistorialReservaDTORespuesta;
import co.edu.unicauca.microreservas.fachadaServices.DTO.ReporteDTOItem; // <--- Tu nuevo DTO
import co.edu.unicauca.microreservas.fachadaServices.DTO.ReporteDTOPeticion;
import co.edu.unicauca.microreservas.fachadaServices.DTO.ReporteDTORespuesta;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReporteServiceImpl implements IReporteService {

    private final ReservaRepository reservaRepository;
    private final HistorialReservaRepository historialRepository;
    private final ModelMapper modelMapper;

    public ReporteServiceImpl(ReservaRepository reservaRepository,
                              HistorialReservaRepository historialRepository,
                              ModelMapper modelMapper) {
        this.reservaRepository = reservaRepository;
        this.historialRepository = historialRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public ReporteDTORespuesta generarReporte(ReporteDTOPeticion peticion) {

        // 1. Validación manual (ya que quitaste los @NotNull del DTO)
        if (peticion.getFechaInicio() == null || peticion.getFechaFin() == null) {
            throw new RuntimeException("BAD_REQUEST");
        }
        if (peticion.getFechaInicio().isAfter(peticion.getFechaFin())) {
            throw new RuntimeException("BAD_REQUEST");
        }

        // 2. Traer Reservas de la BD
        List<ReservaEntity> lista = reservaRepository.buscarParaReporte(
                peticion.getFechaInicio(),
                peticion.getFechaFin(),
                peticion.getIdBarbero(),
                peticion.getIdServicio()
        );

        // 3. Calcular Totales (Convertimos de long a int aquí)
        int completadas = (int) lista.stream().filter(r -> r.getEstado() == EstadoReservaEnum.COMPLETADA).count();
        int canceladas = (int) lista.stream().filter(r -> r.getEstado() == EstadoReservaEnum.CANCELADA).count();
        int pendientes = (int) lista.stream().filter(r -> r.getEstado() == EstadoReservaEnum.PENDIENTE).count();
        int total = lista.size();

        // 4. Calcular Desgloses (Listas)
        // Agrupar por Barbero
        List<ReporteDTOItem> listaPorBarbero = lista.stream()
                .collect(Collectors.groupingBy(r -> r.getAgenda().getIdBarbero(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new ReporteDTOItem(entry.getKey(), entry.getValue().intValue())) // <--- .intValue()
                .toList();

        // Agrupar por Servicio
        List<ReporteDTOItem> listaPorServicio = lista.stream()
                .collect(Collectors.groupingBy(ReservaEntity::getIdServicio, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new ReporteDTOItem(entry.getKey(), entry.getValue().intValue())) // <--- .intValue()
                .toList();

        // 5. Retornar
        return ReporteDTORespuesta.builder()
                .totalReservas(total)
                .totalConfirmadas(completadas)
                .totalCanceladas(canceladas)
                .totalPendientes(pendientes)
                .porBarbero(listaPorBarbero)
                .porServicio(listaPorServicio)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HistorialReservaDTORespuesta> consultarHistorial(Integer idReserva) {
        if (!reservaRepository.existsById(idReserva)) {
            throw new RuntimeException("NOT_FOUND");
        }

        List<HistorialReservaEntity> historial = historialRepository
                .findByReserva_IdReservaOrderByFechaCambioDesc(idReserva);

        return historial.stream()
                .map(entity -> modelMapper.map(entity, HistorialReservaDTORespuesta.class))
                .toList();
    }
}