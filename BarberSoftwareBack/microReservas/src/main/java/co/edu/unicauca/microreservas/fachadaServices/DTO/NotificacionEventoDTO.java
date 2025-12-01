package co.edu.unicauca.microreservas.fachadaServices.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificacionEventoDTO {

    // Estructura exacta solicitada por MicroNotificaciones
    private Long idReserva;
    private Long clienteId;
    private Long barberoId;
    private LocalDateTime horaInicio;
    private LocalDateTime horaFin;
    private String serviceName;
    private String estado;
}