package co.edu.unicauca.microreservas.fachadaServices.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservaDTOPeticion {

    private Integer idBarbero;

    private Integer idServicio;

    private LocalDate fecha;

    private LocalTime horaInicio;

    private String tokenPago;

    // NOTA: No incluimos idUsuario aquí porque, como acordamos,
    // ese dato lo extraemos del Token en el Controlador por seguridad.
}