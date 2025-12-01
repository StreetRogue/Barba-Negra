package co.edu.unicauca.microreservas.capaControladores.controladorExcepciones;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> manejarRuntime(RuntimeException ex) {

        String mensaje = ex.getMessage();

        // NOT_FOUND → 404
        if ("NOT_FOUND".equals(mensaje)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("El recurso solicitado no existe");
        }

        // BAD_REQUEST → 400
        if ("BAD_REQUEST".equals(mensaje)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Datos inválidos o incompletos");
        }

        // UNAUTHORIZED → 401
        if ("UNAUTHORIZED".equals(mensaje)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("No autorizado");
        }

        // CONFLICT → 409
        if ("CONFLICT".equals(mensaje)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("El registro ya existe");
        }


        if (mensaje.startsWith("ERROR_PAGO_STRIPE")) {
            String detalle = mensaje.replace("ERROR_PAGO_STRIPE: ", "");
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body("Pago rechazado: " + detalle);
        }

        if (mensaje.startsWith("ERROR_ARITMETICO")) {
            String detalle = mensaje.replace("ERROR_ARITMETICO: ", "");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error en el monto: " + detalle);
        }

        // Default → 500
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
    }

    // Para cualquier excepción no manejada
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> manejarGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
    }
}
