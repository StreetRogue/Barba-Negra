package co.edu.unicauca.micronotificaciones.services;

import co.edu.unicauca.micronotificaciones.services.DTOs.ReservaNotificacionDTO;
import org.springframework.stereotype.Service;

/**
 * Servicio de simulación de envío de correos electrónicos.
 * En un microservicio real, esto usaría JavaMailSender o una librería como SendGrid.
 */
@Service
public class EmailServices {

    /**
     * Simula el envío de un correo electrónico para notificar sobre un evento de reserva.
     * * @param emailDestino Email del destinatario.
     * @param asunto Asunto del correo.
     * @param cuerpo Contenido HTML/texto del correo.
     */
    public void sendEmail(String emailDestino, String asunto, String cuerpo) {
        System.out.println("\n=============================================");
        System.out.println("📧 SIMULACIÓN DE ENVÍO DE CORREO ELECTRÓNICO");
        System.out.println("Destinatario: " + emailDestino);
        System.out.println("Asunto: " + asunto);
        System.out.println("---------------------------------------------");
        System.out.println("Cuerpo del mensaje: " + cuerpo);
        System.out.println("=============================================");
    }

    /**
     * Construye y envía el correo electrónico de Confirmación de Reserva.
     */
    public void sendConfirmacion(String email, String nombre, ReservaNotificacionDTO reserva, String fechaYHora) {
        String asunto = "Reserva Confirmada: " + reserva.getServiceName();
        String cuerpo = String.format(
                "Hola %s,\n\nTu cita para el servicio de %s ha sido confirmada para el %s.\n\n" +
                        "¡Te esperamos!\n\nID de Reserva: %d",
                nombre, reserva.getServiceName(), fechaYHora, reserva.getIdReserva()
        );
        sendEmail(email, asunto, cuerpo);
    }

    /**
     * Construye y envía el correo electrónico de Cancelación de Reserva.
     */
    public void sendCancelacion(String email, String nombre, ReservaNotificacionDTO reserva) {
        String asunto = "Reserva Cancelada: " + reserva.getServiceName();
        String cuerpo = String.format(
                "Estimado/a %s,\n\nLamentamos informarte que la reserva para el servicio de %s ha sido cancelada.\n\n" +
                        "Por favor, agenda una nueva cita si lo deseas.\n\nID de Reserva: %d",
                nombre, reserva.getServiceName(), reserva.getIdReserva()
        );
        sendEmail(email, asunto, cuerpo);
    }

    /**
     * Construye y envía el correo electrónico de Reprogramación de Reserva.
     */
    public void sendReprogramacion(String email, String nombre, ReservaNotificacionDTO reserva, String fechaYHora) {
        String asunto = "Aviso: Reserva Reprogramada";
        String cuerpo = String.format(
                "Hola %s,\n\nTu reserva para el servicio de %s ha sido reprogramada y ahora es para el %s.\n\n" +
                        "Verifica los detalles en tu dashboard.\n\nID de Reserva: %d",
                nombre, reserva.getServiceName(), fechaYHora, reserva.getIdReserva()
        );
        sendEmail(email, asunto, cuerpo);
    }
}