package co.edu.unicauca.microreservas.fachadaServices.DTO;

import lombok.Data;

@Data
public class UsuarioExternoDTO {
    private Integer id; // Ojo: Si en microUsuarios es Long, aquí lo recibimos, pero tu BD usa Integer.
    private String email;
    private String nombre;
}