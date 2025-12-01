package co.edu.unicauca.microreservas.fachadaServices.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReporteDTOItem {
    private Integer id;      // El ID del Barbero o del Servicio
    private Integer cantidad;   // Cuántas reservas tiene ese ID
}
