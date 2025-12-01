package co.edu.unicauca.micronotificaciones.listener;

import co.edu.unicauca.micronotificaciones.models.Notificacion;
import co.edu.unicauca.micronotificaciones.services.DTOs.ReservaNotificacionDTO;
import co.edu.unicauca.micronotificaciones.services.NotificacionFacade;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component; // <-- 1. Se cambió a @Component

@Component // Usar @Component para clases consumidoras/oyentes
public class NotificacionRabbitListener {

    private final NotificacionFacade fachada;

    // Inyección de la Fachada para la lógica de negocio
    public NotificacionRabbitListener(NotificacionFacade fachada) {
        this.fachada = fachada;
    }

    /**
     * Escucha la cola de RabbitMQ. El nombre de la cola debe coincidir con la
     * configuración del productor (el microservicio que crea la reserva).
     * Nota: Asegúrate de que el 'RabbitListener' esté habilitado en la configuración de Spring.
     */
    @RabbitListener(queues = "${rabbitmq.queues.reserva-notificacion}")
    public void recibirNotificacionReserva(ReservaNotificacionDTO reservaData) {

        // Mensaje actualizado para mostrar el estado, que es clave para la lógica
        System.out.println("✅ Mensaje de Reserva recibido. ID: " + reservaData.getIdReserva() +
                ", Estado: " + reservaData.getEstado()); // <-- Mensaje más claro

        // 1. Validaciones básicas (opcional)
        // Usamos getIdReserva() para la validación más crítica
        if (reservaData.getIdReserva() == null) {
            System.err.println("Error: El mensaje de reserva es inválido. Falta el ID de la Reserva.");
            return;
        }

        // 2. Delegar la lógica de persistencia, programación y envío a la Fachada
        fachada.procesarReserva(reservaData);
    }


}