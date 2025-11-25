package co.edu.unicauca.microUsuarios.services.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BarberoDTOPeticion {
    private Long id;        // id generado en micro-usuarios
    private String nombre;
    private String email;
    private String telefono;
    private String estado;  // "Activo" / "Inactivo" según tu lógica
}
