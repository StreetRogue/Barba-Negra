package co.edu.unicauca.barbersoftwareback.fachadaServices.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServicioDTOPeticion {

    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer duracionMinutos;

    private String imagenBase64;
    private String estado;

    private CategoriaDTOPeticion categoria;

}

