package co.edu.unicauca.microreservas.fachadaServices.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class ServicioExternoDTO {
    private Integer id;
    private String nombre;
    private BigDecimal precio;
    private Integer duracionMinutos; // ¡Este es el dato vital para los slots!
}
