package co.edu.unicauca.microreservas.fachadaServices.services;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.AgendaDiariaEntity;
import co.edu.unicauca.microreservas.capaAccesoDatos.models.EstadoReservaEnum;
import co.edu.unicauca.microreservas.capaAccesoDatos.models.ReservaEntity;
import co.edu.unicauca.microreservas.capaAccesoDatos.repositories.AgendaDiariaRepository;
import co.edu.unicauca.microreservas.capaAccesoDatos.repositories.HistorialReservaRepository;
import co.edu.unicauca.microreservas.capaAccesoDatos.repositories.ReservaRepository;
import co.edu.unicauca.microreservas.fachadaServices.DTO.*;
import co.edu.unicauca.microreservas.infra.BarberoClient;
import co.edu.unicauca.microreservas.infra.UsuarioClient;
import co.edu.unicauca.microreservas.infra.rabbitmq.NotificacionPublisher;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservaServiceImpl implements IReservaService {

    private final ReservaRepository reservaRepository;
    private final AgendaDiariaRepository agendaRepository;
    private final BarberoClient barberoClient;
    private final ModelMapper modelMapper;
    private final IPasarelaPagoService paymentService;
    private final HistorialReservaRepository historialRepository;
    private final NotificacionPublisher notificacionPublisher;
    private final UsuarioClient usuarioClient;

    public ReservaServiceImpl(
            ReservaRepository reservaRepository,
            AgendaDiariaRepository agendaRepository,
            BarberoClient barberoClient,
            ModelMapper modelMapper, IPasarelaPagoService paymentService,
            HistorialReservaRepository historialRepository,
            NotificacionPublisher notificacionPublisher,
            UsuarioClient usuarioClient
    ) {
        this.reservaRepository = reservaRepository;
        this.agendaRepository = agendaRepository;
        this.barberoClient = barberoClient;
        this.modelMapper = modelMapper;
        this.paymentService = paymentService;
        this.historialRepository = historialRepository;
        this.notificacionPublisher = notificacionPublisher;
        this.usuarioClient = usuarioClient;

        // --- CONFIGURACIÓN DEL MAPPER ---
        this.modelMapper.typeMap(ReservaEntity.class, ReservaDTORespuesta.class)
                .addMapping(src -> src.getAgenda().getIdBarbero(), ReservaDTORespuesta::setIdBarbero);
    }

    @Override
    @Transactional
    public ReservaDTORespuesta crearReserva(Integer idUsuario,String emailCliente ,ReservaDTOPeticion peticion) {

        // 1. Validaciones básicas
        if (peticion == null) throw new RuntimeException("BAD_REQUEST");

        // 2. Obtener info del Servicio (Duración) desde MicroBarberos
        ServicioExternoDTO servicio = barberoClient.obtenerServicio(peticion.getIdServicio());
        if (servicio == null) {
            throw new RuntimeException("NOT_FOUND");
        }

        // 3. Calcular Fechas Exactas
        LocalDateTime inicio = LocalDateTime.of(peticion.getFecha(), peticion.getHoraInicio());
        LocalDateTime fin = inicio.plusMinutes(servicio.getDuracionMinutos());
        if (inicio.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("BAD_REQUEST");}

        // 4. Gestionar la Agenda (Padre) - Lazy Creation
        AgendaDiariaEntity agenda = agendaRepository
                .findByIdBarberoAndFecha(peticion.getIdBarbero(), peticion.getFecha())
                .orElseGet(() -> {
                    // Si no existe agenda para ese día, la creamos
                    AgendaDiariaEntity nueva = AgendaDiariaEntity.builder()
                            .idBarbero(peticion.getIdBarbero())
                            .fecha(peticion.getFecha())
                            .build();
                    return agendaRepository.save(nueva);
                });

        // 5. Validar Disponibilidad (Cruces de Horario)
        List<ReservaEntity> cruces = reservaRepository
                .findByAgenda_IdAgendaAndHoraInicioLessThanAndHoraFinGreaterThan(
                        agenda.getIdAgenda(), fin, inicio
                );

        // Filtramos: Solo nos importan los cruces que NO estén cancelados
        boolean ocupado = cruces.stream()
                .anyMatch(r -> r.getEstado() != EstadoReservaEnum.CANCELADA);

        if (ocupado) {
            throw new RuntimeException("CONFLICT");
        }

        // --- . OBTENER ID REAL ---
        // Ignoramos el idUsuarioHash y buscamos el real usando el email

        UsuarioExternoDTO usuarioReal = usuarioClient.buscarPorEmail(emailCliente);

        //Procesamiento del Pago
        String idTransaccion = paymentService.procesarPago(servicio.getPrecio(), peticion.getTokenPago());

        // 6. Mapeo Manual / Construcción de la Entidad
        // Nota: No uso modelMapper para la Peticion->Entidad completo porque hay lógica calculada
        ReservaEntity reserva = new ReservaEntity();
        reserva.setAgenda(agenda);             // Relación con el padre
        reserva.setIdUsuario(usuarioReal.getId());       // ID del Token
        reserva.setIdServicio(peticion.getIdServicio());
        reserva.setHoraInicio(inicio);
        reserva.setHoraFin(fin);
        reserva.setEstado(EstadoReservaEnum.PENDIENTE); // Estado Inicial
        reserva.setIdTransaccion(idTransaccion);

        // 7. Guardar
        ReservaEntity saved = reservaRepository.save(reserva);

        // Memento Inicial
        historialRepository.save(saved.guardarMemento());

        // 8. ENVIAR EVENTO A RABBITMQ
        try {
            NotificacionEventoDTO evento = NotificacionEventoDTO.builder()
                    // Conversión Integer -> Long
                    .idReserva(saved.getIdReserva().longValue())
                    .clienteId(saved.getIdUsuario().longValue())
                    .barberoId(saved.getAgenda().getIdBarbero().longValue())

                    // Fechas (LocalDateTime pasa directo)
                    .horaInicio(saved.getHoraInicio())
                    .horaFin(saved.getHoraFin())

                    // Datos extra
                    .serviceName(servicio.getNombre())
                    .estado(saved.getEstado().name())
                    .build();

            notificacionPublisher.enviarNotificacion(evento);

        } catch (Exception e) {
            // Logueamos pero NO fallamos la reserva. El correo puede reintentarse luego.
            System.err.println("Error construyendo/enviando notificación: " + e.getMessage());
        }
        // 9. Retornar Respuesta
        return modelMapper.map(saved, ReservaDTORespuesta.class);
    }

    @Override
    @Transactional
    public ReservaDTORespuesta iniciarServicio(Integer idReserva,String emailUsuario) {

        UsuarioExternoDTO usuarioReal = usuarioClient.buscarPorEmail(emailUsuario);

        // 1. Buscar la reserva
        ReservaEntity reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // 2. VALIDACIÓN DE DUEÑO (Barbero) - ¡CRUCIAL!
        // Obtenemos quién es el dueño de la agenda de esta reserva
        Integer idBarberoAsignado = reserva.getAgenda().getIdBarbero();

        // Si el que intenta iniciar (idUsuarioSolicitante) NO es el barbero dueño... ¡BLOQUEAR!
        if (!idBarberoAsignado.equals(usuarioReal.getId())) {
            throw new RuntimeException("UNAUTHORIZED");
        }

        // 3. VALIDACIÓN DE ESTADO
        // Solo inicia si está PENDIENTE o REPROGRAMADA
        if (reserva.getEstado() != EstadoReservaEnum.PENDIENTE && reserva.getEstado() != EstadoReservaEnum.REPROGRAMADA) {
            throw new RuntimeException("CONFLICT");
        }

        // 4. Cambio de estado
        reserva.setEstado(EstadoReservaEnum.EN_PROCESO);

        // 5. Memento (Guardar historial)
        historialRepository.save(reserva.guardarMemento());

        ReservaEntity saved = reservaRepository.save(reserva);
        return modelMapper.map(saved, ReservaDTORespuesta.class);
    }

    @Override
    @Transactional
    public ReservaDTORespuesta cancelarReserva(Integer idReserva, String emailUsuario) {

        UsuarioExternoDTO usuarioReal = usuarioClient.buscarPorEmail(emailUsuario);

        // 1. Buscar Reserva
        ReservaEntity reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // consultar servicio para enviarselo a la cola
        ServicioExternoDTO servicio = barberoClient.obtenerServicio(reserva.getIdServicio());
        // 2. Validar que sea el dueño (o Admin, si tuvieras roles aquí)
        if (!reserva.getIdUsuario().equals(usuarioReal.getId())) {
            throw new RuntimeException("UNAUTHORIZED");
        }

        // 3. Validar Estado Actual
        if (reserva.getEstado() == EstadoReservaEnum.CANCELADA) {
            throw new RuntimeException("CONFLICT");
        }

        // 4. Validar Regla de Negocio RN09 (Anticipación de 2 horas)
        // Calculamos: HoraInicio - 2 horas
//        LocalDateTime limiteCancelacion = reserva.getHoraInicio().minusHours(2);
//        if (LocalDateTime.now().isAfter(limiteCancelacion)) {
//            throw new RuntimeException("CONFLICT");
//        }

        // 5. Cambiar Estado
        reserva.setEstado(EstadoReservaEnum.CANCELADA);

        // 6. PATRÓN MEMENTO: Guardar estado anterior antes de cambiar
        // Asumiendo que tienes un HistorialReservaRepository inyectado
        historialRepository.save(reserva.guardarMemento());

        // Opcional: Si integraste Stripe, aquí podrías llamar a paymentService.reembolsar(...)

        ReservaEntity saved = reservaRepository.save(reserva);


        //  ENVIAR EVENTO A RABBITMQ
        try {
            NotificacionEventoDTO evento = NotificacionEventoDTO.builder()
                    // Conversión Integer -> Long
                    .idReserva(saved.getIdReserva().longValue())
                    .clienteId(saved.getIdUsuario().longValue())
                    .barberoId(saved.getAgenda().getIdBarbero().longValue())

                    // Fechas (LocalDateTime pasa directo)
                    .horaInicio(saved.getHoraInicio())
                    .horaFin(saved.getHoraFin())

                    // Datos extra
                    .serviceName(servicio.getNombre())
                    .estado(saved.getEstado().name())
                    .build();

            notificacionPublisher.enviarNotificacion(evento);

        } catch (Exception e) {
            // Logueamos pero NO fallamos la reserva. El correo puede reintentarse luego.
            System.err.println("Error construyendo/enviando notificación: " + e.getMessage());
        }
        return modelMapper.map(saved, ReservaDTORespuesta.class);
    }

    // --- 3. REPROGRAMAR RESERVA (Nuevo) ---
    @Override
    @Transactional
    public ReservaDTORespuesta reprogramarReserva(Integer idReserva, String emailUsuario , ReservaDTOPeticion nuevosDatos) {

        UsuarioExternoDTO usuarioReal = usuarioClient.buscarPorEmail(emailUsuario);

        ReservaEntity reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        if (!reserva.getIdUsuario().equals(usuarioReal.getId())) {
            throw new RuntimeException("UNAUTHORIZED");
        }

        // Regla de tiempo para reprogramar (asumimos la misma de cancelar)
//        if (LocalDateTime.now().isAfter(reserva.getHoraInicio().minusHours(2))) {
//            throw new RuntimeException("CONFLICT");
//        }

        // Calcular nuevos tiempos
        ServicioExternoDTO servicio = barberoClient.obtenerServicio(reserva.getIdServicio());
        LocalDateTime nuevoInicio = LocalDateTime.of(nuevosDatos.getFecha(), nuevosDatos.getHoraInicio());
        LocalDateTime nuevoFin = nuevoInicio.plusMinutes(servicio.getDuracionMinutos());
        if (nuevoInicio.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("BAD_REQUEST");}

        // Gestionar Nueva Agenda (si cambió de día o barbero)
        AgendaDiariaEntity nuevaAgenda = agendaRepository
                .findByIdBarberoAndFecha(nuevosDatos.getIdBarbero(), nuevosDatos.getFecha())
                .orElseGet(() -> {
                    AgendaDiariaEntity nueva = AgendaDiariaEntity.builder()
                            .idBarbero(nuevosDatos.getIdBarbero())
                            .fecha(nuevosDatos.getFecha())
                            .build();
                    return agendaRepository.save(nueva);
                });

        // Validar Disponibilidad
        List<ReservaEntity> cruces = reservaRepository
                .findByAgenda_IdAgendaAndHoraInicioLessThanAndHoraFinGreaterThan(
                        nuevaAgenda.getIdAgenda(), nuevoFin, nuevoInicio
                );

        // Validar que no choque con otras (excluyendo a sí misma si es el mismo día)
        boolean ocupado = cruces.stream()
                .anyMatch(r -> !r.getIdReserva().equals(idReserva) && r.getEstado() != EstadoReservaEnum.CANCELADA);

        if (ocupado) {
            throw new RuntimeException("CONFLICT");
        }

        reserva.setAgenda(nuevaAgenda);
        reserva.setHoraInicio(nuevoInicio);
        reserva.setHoraFin(nuevoFin);
        reserva.setEstado(EstadoReservaEnum.REPROGRAMADA);

        // Memento y Actualización
        historialRepository.save(reserva.guardarMemento());

        ReservaEntity saved = reservaRepository.save(reserva);

        //  ENVIAR EVENTO A RABBITMQ
        try {
            NotificacionEventoDTO evento = NotificacionEventoDTO.builder()
                    // Conversión Integer -> Long
                    .idReserva(saved.getIdReserva().longValue())
                    .clienteId(saved.getIdUsuario().longValue())
                    .barberoId(saved.getAgenda().getIdBarbero().longValue())

                    // Fechas (LocalDateTime pasa directo)
                    .horaInicio(saved.getHoraInicio())
                    .horaFin(saved.getHoraFin())

                    // Datos extra
                    .serviceName(servicio.getNombre())
                    .estado(saved.getEstado().name())
                    .build();

            notificacionPublisher.enviarNotificacion(evento);

        } catch (Exception e) {
            // Logueamos pero NO fallamos la reserva. El correo puede reintentarse luego.
            System.err.println("Error construyendo/enviando notificación: " + e.getMessage());
        }
        return modelMapper.map(saved, ReservaDTORespuesta.class);
    }

    // --- 4. MARCAR COMPLETADA (Nuevo) ---
    @Override
    @Transactional
    public ReservaDTORespuesta marcarCompletada(Integer idReserva, String emailUsuario) {

        UsuarioExternoDTO usuarioReal = usuarioClient.buscarPorEmail(emailUsuario);

        ReservaEntity reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Validación de estado
        if (reserva.getEstado() != EstadoReservaEnum.EN_PROCESO) {
            throw new RuntimeException("CONFLICT");
        }

        reserva.setEstado(EstadoReservaEnum.COMPLETADA);

        // Memento
        historialRepository.save(reserva.guardarMemento());

        ReservaEntity saved = reservaRepository.save(reserva);
        return modelMapper.map(saved, ReservaDTORespuesta.class);
    }

    // --- 6. MARCAR NO PRESENTADO (Ausencia) ---
    @Override
    @Transactional
    public ReservaDTORespuesta marcarNoPresentado(Integer idReserva, String emailUsuario) {

        UsuarioExternoDTO usuarioReal = usuarioClient.buscarPorEmail(emailUsuario);

        // 1. Buscar Reserva
        ReservaEntity reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));
        ServicioExternoDTO servicio = barberoClient.obtenerServicio(reserva.getIdServicio());
        // 2. VALIDACIÓN DE DUEÑO (Solo el Barbero puede juzgar la ausencia)
        Integer idBarberoAsignado = reserva.getAgenda().getIdBarbero();
        if (!idBarberoAsignado.equals(usuarioReal.getId())) {
            throw new RuntimeException("UNAUTHORIZED");
        }

        // 3. VALIDACIÓN DE ESTADO
        // Solo tiene sentido si la cita estaba activa y esperando (PENDIENTE o REPROGRAMADA)
        if (reserva.getEstado() != EstadoReservaEnum.PENDIENTE && reserva.getEstado() != EstadoReservaEnum.REPROGRAMADA) {
            throw new RuntimeException("CONFLICT");
        }

//        // 4. VALIDACIÓN DE TOLERANCIA (RN02 - 10 Minutos)
//        // Calculamos la hora mínima para declarar ausencia: HoraInicio + 10 min
//        LocalDateTime horaInicio = reserva.getHoraInicio();
//        LocalDateTime tiempoTolerancia = horaInicio.plusMinutes(10);
//
//        // Si "Ahora" es ANTES de "HoraInicio + 10", es muy temprano para marcar No Show
//        if (LocalDateTime.now().isBefore(tiempoTolerancia)) {
//            throw new RuntimeException("CONFLICT: Aún está dentro del tiempo de tolerancia (10 min). Espere al cliente.");
//        }

        // 5. Actualizar Estado
        reserva.setEstado(EstadoReservaEnum.NO_PRESENTADO);

        // 6. PATRÓN MEMENTO
        historialRepository.save(reserva.guardarMemento());


        ReservaEntity saved = reservaRepository.save(reserva);

        //  ENVIAR EVENTO A RABBITMQ
        try {
            NotificacionEventoDTO evento = NotificacionEventoDTO.builder()
                    // Conversión Integer -> Long
                    .idReserva(saved.getIdReserva().longValue())
                    .clienteId(saved.getIdUsuario().longValue())
                    .barberoId(saved.getAgenda().getIdBarbero().longValue())

                    // Fechas (LocalDateTime pasa directo)
                    .horaInicio(saved.getHoraInicio())
                    .horaFin(saved.getHoraFin())

                    // Datos extra
                    .serviceName(servicio.getNombre())
                    .estado(saved.getEstado().name())
                    .build();

            notificacionPublisher.enviarNotificacion(evento);

        } catch (Exception e) {
            // Logueamos pero NO fallamos la reserva. El correo puede reintentarse luego.
            System.err.println("Error construyendo/enviando notificación: " + e.getMessage());
        }
        return modelMapper.map(saved, ReservaDTORespuesta.class);
    }

    // Listar todas las reservas
    @Override
    @Transactional(readOnly = true) // Importante para rendimiento en lectura
    public List<ReservaDTORespuesta> listarTodas() {

        // 1. Buscar todo en la BD
        List<ReservaEntity> reservas = reservaRepository.findAll();

        // 2. Convertir Entity -> DTO usando el Mapper
        return reservas.stream()
                .map(entity -> modelMapper.map(entity, ReservaDTORespuesta.class))
                .toList(); // O .collect(Collectors.toList()) en versiones viejas de Java
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaDTORespuesta> listarPorCliente(String emailCliente) {

        UsuarioExternoDTO usuarioReal = usuarioClient.buscarPorEmail(emailCliente);

        // 1. Consultar BD usando el método nativo de Spring Data
        List<ReservaEntity> reservas = reservaRepository.findByIdUsuario(usuarioReal.getId());

        // 2. Convertir a DTOs
        return reservas.stream()
                .map(entity -> modelMapper.map(entity, ReservaDTORespuesta.class))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReservaDTORespuesta consultarPorId(Integer idReserva) {

        // 1. Buscar en BD
        ReservaEntity reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // 2. Convertir a DTO
        return modelMapper.map(reserva, ReservaDTORespuesta.class);
    }

    // --- 10. LISTAR AGENDA DE TRABAJO (Vista Barbero) ---
    @Override
    @Transactional(readOnly = true)
    public List<ReservaDTORespuesta> listarAgendaBarbero(String emailBarbero) {

        // 1. Obtener el ID del Barbero usando el email (Igual que en cliente)
        UsuarioExternoDTO usuarioReal = usuarioClient.buscarPorEmail(emailBarbero);

        // 2. Consultar BD: Buscamos las reservas asociadas a la AGENDA de este barbero
        // Asegúrate de tener este método en tu ReservaRepository: findByAgenda_IdBarbero
        List<ReservaEntity> reservas = reservaRepository.findByAgenda_IdBarbero(usuarioReal.getId());

        // 3. Convertir a DTOs (Directo, sin hidratación extra)
        return reservas.stream()
                .map(entity -> modelMapper.map(entity, ReservaDTORespuesta.class))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaDTORespuesta> listarAgendaHoyBarbero(Integer idBarbero) {

        // 1. Definir el rango de tiempo: HOY (Desde 00:00 hasta 23:59:59)
        LocalDateTime inicioDia = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime finDia = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);

        // 2. Buscar reservas activas en ese rango
        // Usamos un método del repositorio que busque por:
        // - ID de Agenda (Barbero)
        // - Rango de Fecha (horaInicio entre inicioDia y finDia)
        // - Estado NO Cancelado (opcional si quieres mostrar huecos libres vs ocupados)

        // Nota: Asumiendo que AgendaDiariaEntity tiene la fecha, podríamos buscar primero la agenda de hoy.
        // Pero es más directo buscar reservas por agenda.idBarbero y rango de fechas.

        List<ReservaEntity> reservasHoy = reservaRepository.findByAgenda_IdBarberoAndHoraInicioBetween(
                idBarbero,
                inicioDia,
                finDia
        );

        // 3. Filtrar Canceladas (si el repositorio trae todo)
        List<ReservaEntity> activas = reservasHoy.stream()
                .filter(r -> r.getEstado() != EstadoReservaEnum.CANCELADA)
                .toList();

        // 4. Convertir a DTO
        return activas.stream()
                .map(entity -> modelMapper.map(entity, ReservaDTORespuesta.class))
                .toList();
    }
}