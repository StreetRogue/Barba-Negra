package co.edu.unicauca.microUsuarios.mappers;

import co.edu.unicauca.microUsuarios.modelos.User;
import co.edu.unicauca.microUsuarios.services.Dtos.BarberResponseDTO;
import co.edu.unicauca.microUsuarios.services.Dtos.UserResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponseDTO toUserResponseDTO(User u) {
        return new UserResponseDTO(
                u.getId(),
                u.getAuth0Id(), // Nuevo campo
                u.getEmail(),
                u.getNombre(),
                u.getTelefono(),
                u.getImagenUrl(), // Nuevo campo
                u.getRole()
        );
    }

    public BarberResponseDTO toBarberResponseDTO(User u) {
        String estado = u.getActivo() ? "Activo" : "Inactivo";
        return new BarberResponseDTO(
                u.getId(),
                u.getNombre(),
                u.getEmail(),
                u.getTelefono(),
                estado
        );
    }
}