package co.edu.unicauca.barbersoftwareback.fachadaServices.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BarberoDTOPeticion {
    private Integer id; // viene desde microUsuarios
    private String nombre;
    private String email;
    private String telefono;
    private String estado;
}


