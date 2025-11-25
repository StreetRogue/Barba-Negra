package co.edu.unicauca.microUsuarios.services.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BarberResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private String estado;
}
