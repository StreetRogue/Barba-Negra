package co.edu.unicauca.microreservas.fachadaServices.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReporteDTORespuesta {

    // --- Parte 1: Totales Generales (KPIs) ---
    private Integer totalReservas;
    private Integer totalConfirmadas;
    private Integer totalCanceladas;
    private Integer totalPendientes;

    // --- Parte 2: Desgloses (Listas de items) ---
    // Aquí usamos el DTO auxiliar 'ReporteItemDTO'
    private List<ReporteDTOItem> porBarbero;
    private List<ReporteDTOItem> porServicio;
}