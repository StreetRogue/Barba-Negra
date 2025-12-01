package co.edu.unicauca.micronotificaciones.services;

import co.edu.unicauca.micronotificaciones.models.Notificacion;
import co.edu.unicauca.micronotificaciones.repositories.NotificacionRepository;
import co.edu.unicauca.micronotificaciones.services.DTOs.ReservaNotificacionDTO;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Service
public class NotificationSchedulerService {

    private final SimpMessagingTemplate messagingTemplate;
    private final TaskScheduler taskScheduler;
    private final NotificacionRepository repository;// Inyectamos la fachada para persistir
    private final Map<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    public NotificationSchedulerService(SimpMessagingTemplate messagingTemplate, TaskScheduler taskScheduler, NotificacionRepository repository) {
        this.messagingTemplate = messagingTemplate;
        this.taskScheduler = taskScheduler;
        this.repository = repository;
    }

    // 1. Punto de entrada para programar recordatorios (llamado desde la Fachada)
    public void scheduleReservationReminders(ReservaNotificacionDTO reserva) {
        LocalDateTime startTime = reserva.getHoraInicio();
        LocalDateTime endTime = reserva.getHoraFin();

        // A. Recordatorio de 2 horas pa cancelacion (Cliente)
        scheduleNotification(
                reserva.getClienteId(),
                reserva.getIdReserva(),
                startTime.minusHours(2),
                "Faltan 2 horas para tu reserva de " + reserva.getServiceName() + " deseas  cancelar?.",
                "RECORDATORIO_2H"
        );
        // B. Recordatorio de 1 hora (Cliente)
        scheduleNotification(
                reserva.getClienteId(),
                reserva.getIdReserva(),
                startTime.minusHours(1),
                "Falta 1 hora para tu reserva de " + reserva.getServiceName() + ".",
                "RECORDATORIO_1H"
        );

        // C. Recordatorio de 10 minutos (Cliente)
        scheduleNotification(
                reserva.getClienteId(),
                reserva.getIdReserva(),
                startTime.minusMinutes(10),
                "¡Aviso! Faltan 10 minutos para tu corte de " + reserva.getServiceName() + ".",
                "RECORDATORIO_10M"
        );

        // --- Notificaciones para el BARBERO (ID: Barbero) ---

        // D. ¡NUEVA! Aviso al Barbero 5 minutos antes de la hora de INICIO
        scheduleNotification(
                reserva.getBarberoId(), // <-- Destinatario: Barbero
                reserva.getIdReserva(),
                startTime.minusMinutes(5), // <-- 5 minutos antes del inicio
                "¡Alerta! Tu próximo servicio (" + reserva.getServiceName() + ") inicia en 5 minutos. Prepárate.",
                "RESERVA_INICIA_5M_BARBERO"
        );

        // E. Aviso al Barbero 5 minutos antes de la hora de FIN (Lógica anterior)
        if (endTime != null) {
            scheduleNotification(
                    reserva.getBarberoId(),
                    reserva.getIdReserva(),
                    endTime.minusMinutes(5),
                    "Tu servicio de " + reserva.getServiceName() + " con el cliente " + reserva.getClienteId() + " finaliza en 5 minutos. ¿Deseas terminar/cobrar?",
                    "RESERVA_FINALIZA_5M_BARBERO"
            );
        }
    }

    // 2. Metodo de envío inmediato (para notificaciones no programadas, como la confirmación)
    public void sendImmediateNotification(Long userId, String message) {
        messagingTemplate.convertAndSend(
                "/topic/user-" + userId,
                message
        );
    }


    // 3. Lógica de programación de la tarea
    // Lógica de programación de la tarea
    private void scheduleNotification(Long userId, Long reservaId, LocalDateTime targetTime, String message, String tipo) {
        long delayMillis = Duration.between(LocalDateTime.now(), targetTime).toMillis();

        if (delayMillis > 0) {
            Runnable notificationTask = () -> {
                // 3. PERSISTENCIA DIRECTA ANTES DE ENVIAR
                Notificacion notif = new Notificacion(userId, message, tipo, reservaId);
                repository.save(notif); // <-- Guarda directamente con el Repositorio

                // 4. Enviar por WebSocket
                sendImmediateNotification(userId, message);
            };

            ScheduledFuture<?> future = taskScheduler.schedule(notificationTask, new Date(System.currentTimeMillis() + delayMillis));
            //taskScheduler.schedule(notificationTask, new Date(System.currentTimeMillis() + delayMillis));

            // 3. Guardar el objeto future en el mapa en memoria
            // Usar una clave única (e.g., idReserva + "_" + tipo)
            String taskKey = reservaId + "_" + tipo;
            scheduledTasks.put(taskKey, future);


        } else {
            System.out.println("⚠️ Aviso de " + tipo + " para user " + userId + " no programado: el tiempo ya pasó.");
        }
    }

    public void cancelScheduledReminders(Long idReserva) {

        // Opción 1 (Simple y Rápida): Buscar en el mapa en memoria
        // 3. CORRECCIÓN: Iteramos sobre todas las claves y usamos .startsWith() correctamente.
        scheduledTasks.keySet().stream()
                // Filtramos las claves que empiezan con el ID de la reserva (ej: "1001_")
                .filter(key -> key.startsWith(idReserva + "_"))
                // Recolectamos las claves para poder removerlas después de la iteración
                .toList()
                .forEach(keyToRemove -> {
                    ScheduledFuture<?> future = scheduledTasks.get(keyToRemove);
                    if (future != null && !future.isDone()) {
                        boolean cancelled = future.cancel(false);
                        if (cancelled) {
                            System.out.println("✅ Tarea programada de reserva " + idReserva + " (" + keyToRemove + ") cancelada exitosamente.");
                            scheduledTasks.remove(keyToRemove); // Removemos la tarea del mapa
                        }
                    }
                });
    }
}