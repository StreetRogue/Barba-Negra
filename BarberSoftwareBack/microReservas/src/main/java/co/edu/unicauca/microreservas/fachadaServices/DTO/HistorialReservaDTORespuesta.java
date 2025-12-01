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
public class HistorialReservaDTORespuesta {

    private Integer idHistorial;

    private Integer idReserva;

    private String estadoGuardado;

    private LocalDateTime fechaCambio;
}