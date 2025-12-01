package co.edu.unicauca.microreservas.infra.rabbitmq;

import co.edu.unicauca.microreservas.fachadaServices.DTO.NotificacionEventoDTO;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class NotificacionPublisher {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    // Leemos el mismo nombre del properties
    @Value("${rabbitmq.queue.name}")
    private String nombreCola;

    public void enviarNotificacion(NotificacionEventoDTO evento) {
        try {
            // Usamos la variable inyectada, no una constante fija
            rabbitTemplate.convertAndSend(nombreCola, evento);
            System.out.println("Mensaje enviado a cola '" + nombreCola + "': " + evento);
        } catch (Exception e) {
            System.err.println("Error enviando notificación a RabbitMQ: " + e.getMessage());
        }
    }
}