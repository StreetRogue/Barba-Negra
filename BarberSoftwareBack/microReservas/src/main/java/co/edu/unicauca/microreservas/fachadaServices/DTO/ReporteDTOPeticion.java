package co.edu.unicauca.microreservas.fachadaServices.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReporteDTOPeticion {

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    // Filtros opcionales: si no se envían (son null), se asume "Todos"
    private Integer idBarbero;
    private Integer idServicio;
}