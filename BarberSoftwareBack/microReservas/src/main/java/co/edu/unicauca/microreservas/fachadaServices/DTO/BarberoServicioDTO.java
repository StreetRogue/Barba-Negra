package co.edu.unicauca.microreservas.fachadaServices.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BarberoServicioDTO {
    // Mapeamos lo que devuelve microBarberos
    private Integer id;          // id de la relación
    private Integer barberoId;
    private String nombreBarbero;
    private Integer servicioId;
    private String nombreServicio;
}