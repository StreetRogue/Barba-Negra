package co.edu.unicauca.microUsuarios.services.Dtos;

import co.edu.unicauca.microUsuarios.modelos.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String auth0Id;
    private String email;
    private String nombre;
    private String telefono;
    private String imagenUrl;
    private Role role;
}

