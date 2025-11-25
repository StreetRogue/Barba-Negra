package co.edu.unicauca.microUsuarios.services.Dtos;

import lombok.Data;

@Data
public class RegistroUsuarioAuth0DTO {
    private String email;
    private String nombre;
    private String imagenUrl; // Para guardar la foto de Google
    private String telefono;
}
