package co.edu.unicauca.micronotificaciones.services;

import co.edu.unicauca.micronotificaciones.models.Notificacion;
import co.edu.unicauca.micronotificaciones.repositories.NotificacionRepository;
import co.edu.unicauca.micronotificaciones.services.DTOs.ReservaNotificacionDTO;
import co.edu.unicauca.micronotificaciones.services.DTOs.UserExternalDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class NotificacionFacade {

    @Value("${microservices.usuarios.url}")
    private String usuariosApiUrl;

    private final NotificationSchedulerService schedulerService;
    private final NotificacionRepository repository;
    private final RestTemplate restTemplate;
    private final EmailServices emailServices;


    // Formato de fecha para mensajes profesionales
    private static final DateTimeFormatter FORMATO_FECHA_COMPLETA = DateTimeFormatter.ofPattern("EEEE, d 'de' MMMM 'a las' HH:mm", Locale.forLanguageTag("es"));

    public NotificacionFacade(NotificationSchedulerService schedulerService, NotificacionRepository repository, RestTemplate restTemplate, EmailServices emailServices) {
        this.schedulerService = schedulerService;
        this.repository = repository;
        this.restTemplate = restTemplate;
        this.emailServices = emailServices;
    }

    // --- MÉTODOS DE UTILIDAD ---

    /**
     * Auxiliar que persiste la Notificacion y la envía por WebSocket como String.
     */
    private void enviarYPersistir(Long userId, String message, String tipo, Long idReserva) {
        // 1. Persistir el Modelo para el Historial
        Notificacion notif = new Notificacion(userId, message, tipo, idReserva);
        notif = repository.save(notif);

        // 2. Enviar el String por WebSocket (la firma es sendImmediateNotification(Long, String))
        schedulerService.sendImmediateNotification(userId, notif.getMensaje());
    }

    private UserExternalDTO getClientData(Long clientId) {
        UserExternalDTO defaultData = new UserExternalDTO();
        defaultData.setId(clientId);
        defaultData.setNombre("Cliente ID " + clientId);

        try {
            String url = usuariosApiUrl+"/api/v1/usuarios/" + clientId;
            UserExternalDTO response = restTemplate.getForObject(url, UserExternalDTO.class);

            if (response != null && response.getNombre() != null) {
                return response;
            }
            return defaultData;
        } catch (Exception e) {
            System.err.println("⚠ Error al consultar datos de usuario " + clientId + ": " + e.getMessage());
            return defaultData;
        }
    }

    private String getClientName(Long clientId) {
        return getClientData(clientId).getNombre();
    }

    // --- METODO PRINCIPAL DE RECEPCIÓN (CORREGIDO) ---


    public void procesarReserva(ReservaNotificacionDTO reserva) {
        String estado = reserva.getEstado();

        // 🚨 CORRECCIÓN CRÍTICA: Usamos switch para controlar el flujo y evitar la ejecución incondicional.
        switch (estado) {
            case "PENDIENTE":
                // 1. Notificaciones inmediatas (Confirmación)
                procesarNuevaReserva(reserva);
                // 2. Programación de recordatorios FUTUROS (SOLO si es nueva)
                schedulerService.scheduleReservationReminders(reserva);
                break;

            case "CANCELADA":
            case "REPROGRAMADA":
            case "NO_PRESENTADO":
                // 3. Se ejecuta la lógica de CAMBIO DE ESTADO (que se encarga de CANCELAR tareas)
                procesarCambioEstado(reserva);
                break;

            default:
                System.out.println("ℹ Estado de reserva no requiere acción de notificaciones: " + estado);
                break;
        }
    }

    // --- MÉTODOS DE PROCESAMIENTO AUXILIARES ---

    private void procesarNuevaReserva(ReservaNotificacionDTO reserva) {
        String fechaYHora = reserva.getHoraInicio().format(FORMATO_FECHA_COMPLETA);
        String nombreCliente = getClientName(reserva.getClienteId());
        UserExternalDTO clienteData = getClientData(reserva.getClienteId());

        // --- 1. NOTIFICACIÓN INMEDIATA AL BARBERO ---
        String mensajeBarbero = String.format(
                "¡Nueva reserva CONFIRMADA! Servicio: %s, con el cliente %s, para el %s.",
                reserva.getServiceName(), nombreCliente, fechaYHora
        );
        enviarYPersistir(reserva.getBarberoId(), mensajeBarbero, "RESERVA_CONFIRMADA_BARBERO", reserva.getIdReserva());

        // --- 2. NOTIFICACIÓN INMEDIATA AL CLIENTE ---
        String mensajeCliente = String.format(
                "¡Reserva Confirmada! Tu cita de %s será para el %s.",
                reserva.getServiceName(), fechaYHora
        );
        enviarYPersistir(reserva.getClienteId(), mensajeCliente, "RESERVA_CONFIRMADA_CLIENTE", reserva.getIdReserva());

        if (clienteData.getEmail() != null) {
            emailServices.sendConfirmacion(clienteData.getEmail(), nombreCliente, reserva, fechaYHora);
        }
    }

    public void procesarCambioEstado(ReservaNotificacionDTO reserva) {
        String estado = reserva.getEstado();
        String nombreCliente = getClientName(reserva.getClienteId());
        UserExternalDTO clienteData = getClientData(reserva.getClienteId());

        // 🚨 1. CRÍTICO: CANCELAR TAREAS ANTIGUAS PRIMERO
        schedulerService.cancelScheduledReminders(reserva.getIdReserva());

        if ("CANCELADA".equals(estado)) {
            // --- Notificación para el CLIENTE ---
            String mensajeCliente = String.format("¡Tu reserva de %s ha sido cancelada!.", reserva.getServiceName());
            enviarYPersistir(reserva.getClienteId(), mensajeCliente, "RESERVA_CANCELADA", reserva.getIdReserva());

            // --- Notificación para el BARBERO ---
            String mensajeBarbero = String.format("Cancelación: La reserva del cliente %s ha sido cancelada. Servicio: %s.",
                    nombreCliente, reserva.getServiceName()
            );
            enviarYPersistir(reserva.getBarberoId(), mensajeBarbero, "RESERVA_CANCELADA_BARBERO", reserva.getIdReserva());

            //Envio de correo
            if (clienteData.getEmail() != null) {
                emailServices.sendCancelacion(clienteData.getEmail(), nombreCliente, reserva);
            }
        } else if ("REPROGRAMADA".equals(estado)) {

            // 2. Programar las nuevas tareas con las nuevas horas
            schedulerService.scheduleReservationReminders(reserva);

            String fechaYHora = reserva.getHoraInicio().format(FORMATO_FECHA_COMPLETA);

            // --- Notificación para el CLIENTE ---
            String mensajeCliente = String.format("Tu reserva de %s ha sido reprogramada para el %s.",
                    reserva.getServiceName(), fechaYHora
            );
            enviarYPersistir(reserva.getClienteId(), mensajeCliente, "RESERVA_REPROGRAMADA", reserva.getIdReserva());

            // --- Notificación para el BARBERO ---
            String mensajeBarbero = String.format("Reprogramación: La reserva del cliente %s se movió para el %s.",
                    nombreCliente, fechaYHora
            );

            //Guardado de base de datos
            enviarYPersistir(reserva.getBarberoId(), mensajeBarbero, "RESERVA_REPROGRAMADA_BARBERO", reserva.getIdReserva());


            //Envio de correo
            if (clienteData.getEmail() != null) {
                emailServices.sendReprogramacion(clienteData.getEmail(), nombreCliente, reserva, fechaYHora);
            }

        } else if ("NO_PRESENTADO".equals(estado)) {

            // --- Notificación para el CLIENTE ---
            String mensajeCliente = String.format(
                    "Aviso: No te presentaste a tu servicio de %s, por lo que ha sido marcado como 'No Presentado'.",
                    reserva.getServiceName()
            );
            enviarYPersistir(reserva.getClienteId(), mensajeCliente, "RESERVA_NO_PRESENTADO", reserva.getIdReserva());

            // --- Notificación para el BARBERO ---
            String mensajeBarbero = String.format(
                    "Cliente Ausente: %s para el servicio de %s ha sido marcado como NO PRESENTADO. Su horario ha sido liberado.",
                    nombreCliente, reserva.getServiceName()
            );
            enviarYPersistir(reserva.getBarberoId(), mensajeBarbero, "RESERVA_NO_PRESENTADO_BARBERO", reserva.getIdReserva());
        }
    }

    public List<Notificacion> obtener5NotificacionesDeCliente(Long idCliente) {
        return repository.findTop5ByIdUsuarioOrderByFechaCreacionDesc(idCliente);
    }
}