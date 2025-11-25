package co.edu.unicauca.microUsuarios.services.Dtos;

import lombok.Data;

@Data
public class RegisterBarberoDTO {
    private String nombre;
    private String email;
    private String telefono;
    private String imagenUrl;
}
