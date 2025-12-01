package co.edu.unicauca.barbersoftwareback.fachadaServices.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class    BarberoServicioDTORespuesta {

    private Integer id;          // id de la relación barbero-servicio

    private Integer barberoId;
    private String nombreBarbero;

    private Integer servicioId;
    private String nombreServicio;
}
