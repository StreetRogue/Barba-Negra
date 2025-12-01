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
public class ReservaDTORespuesta {

    private Integer idReserva;
    private Integer idUsuario;   // Confirmamos al cliente su ID (o para admins)
    private Integer idBarbero;
    private Integer idServicio;

    // Aquí ya devolvemos el formato completo de fecha y hora
    // tal como quedó guardado en la Base de Datos (Entity)
    private LocalDateTime horaInicio;
    private LocalDateTime horaFin;

    private String estado;       // "PENDIENTE", "CONFIRMADA", etc.
}