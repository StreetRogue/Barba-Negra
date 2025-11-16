package co.edu.unicauca.microUsuarios.services.Dtos;

import co.edu.unicauca.microUsuarios.modelos.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String email;
    private String nombre;
    private String telefono;
    private Role role;
}

