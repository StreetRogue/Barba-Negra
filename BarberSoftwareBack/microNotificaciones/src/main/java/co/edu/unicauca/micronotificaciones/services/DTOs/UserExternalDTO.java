package co.edu.unicauca.micronotificaciones.services.DTOs;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data// Necesario para la deserialización de JSON
public class UserExternalDTO {
    private Long id;
    private String nombre;
    private String email;// Este es el campo que necesitamos

    public UserExternalDTO() {
    }

    public UserExternalDTO(Long id, String nombre, String  email) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {   // <- ESTE es el que pide NotificacionFacade
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {return email;}

    public void setEmail(String email) {this.email = email;}


}
