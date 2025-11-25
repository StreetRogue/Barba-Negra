package co.edu.unicauca.microUsuarios.services;

import co.edu.unicauca.microUsuarios.exceptions.ConflictException;
import co.edu.unicauca.microUsuarios.exceptions.UnauthorizedException;
import co.edu.unicauca.microUsuarios.integrations.BarberoClient;
import co.edu.unicauca.microUsuarios.mappers.UserMapper;
import co.edu.unicauca.microUsuarios.modelos.Role;
import co.edu.unicauca.microUsuarios.modelos.User;
import co.edu.unicauca.microUsuarios.repositories.UserRepository;
import co.edu.unicauca.microUsuarios.services.Dtos.*;
import co.edu.unicauca.microUsuarios.exceptions.BadRequestException;
import co.edu.unicauca.microUsuarios.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import org.springframework.transaction.annotation.Transactional; // Para lógica de google y correo no google

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BarberoClient barberoClient;

    // ----------------------------------------------------
    // SINCRONIZACIÓN (Login/Registro unificado con Auth0)
    // ----------------------------------------------------
    @Transactional
    public UserResponseDTO sincronizarUsuario(RegistroUsuarioAuth0DTO dto, String auth0Id) {

        // Buscamos si ya existe por email
        Optional<User> existingUserOpt = userRepository.findByEmail(dto.getEmail());

        User user;

        if (existingUserOpt.isPresent()) {
            // CASO 1: El usuario YA EXISTE (Ej: fue creado por Admin o ya se logueó antes)
            user = existingUserOpt.get();

            // Actualizamos el ID de Auth0 si no lo tenía (vinculación de cuentas)
            if (user.getAuth0Id() == null || !user.getAuth0Id().equals(auth0Id)) {
                user.setAuth0Id(auth0Id);
            }
            // Actualizamos la foto siempre, por si la cambió en Google
            user.setImagenUrl(dto.getImagenUrl());

        } else {
            // CASO 2: Usuario NUEVO (Primer login)
            user = User.builder()
                    .email(dto.getEmail())
                    .nombre(dto.getNombre())
                    .imagenUrl(dto.getImagenUrl())
                    .auth0Id(auth0Id) // Guardamos el ID único de Auth0
                    .role(Role.CLIENTE) // Por defecto es Cliente
                    .activo(true)
                    .telefono(dto.getTelefono()) // Puede venir null
                    .build();
        }

        User saved = userRepository.save(user);
        return userMapper.toUserResponseDTO(saved);
    }

    // -----------------------------------------
    // Registrar Barbero (admin)
    // -----------------------------------------
    @Transactional
    public BarberResponseDTO registerBarbero(RegisterBarberoDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ConflictException("El correo ya está registrado");
        }

        // Creamos el barbero SIN contraseña y SIN auth0Id todavía.
        // Cuando el barbero entre por primera vez con ese correo, el método 'sincronizarUsuario'
        // encontrará este registro y le pegará el Auth0Id.
        User barbero = User.builder()
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                // .password(...) -> ELIMINADO
                .telefono(dto.getTelefono())
                .imagenUrl(dto.getImagenUrl())
                .role(Role.BARBERO)
                .activo(true)
                .build();

        User saved = userRepository.save(barbero);

        // Mapeos y llamada a microservicio externo
        BarberResponseDTO respuestaUsuarios = userMapper.toBarberResponseDTO(saved);

        BarberoDTOPeticion peticionBarberos = new BarberoDTOPeticion(
                respuestaUsuarios.getId(),
                respuestaUsuarios.getNombre(),
                respuestaUsuarios.getEmail(),
                respuestaUsuarios.getTelefono(),
                respuestaUsuarios.getEstado()
        );

        barberoClient.crearBarbero(peticionBarberos);

        return respuestaUsuarios;
    }



    // -----------------------------------------
    // Consulta de usuario (admin)
    // -----------------------------------------
    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("El usuario con ID " + id + " no existe."));

        return userMapper.toUserResponseDTO(user);
    }

    // -----------------------------------------
    // Desactivar usuario (admin)
    // -----------------------------------------
    @Transactional
    public void desactivarUsuario(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("No se puede desactivar. Usuario con ID " + id + " no existe."));

        user.setActivo(false);
        userRepository.save(user);
    }


    // -----------------------------------------
    // Listar Barberos (admin)
    // -----------------------------------------
    public List<UserResponseDTO> listarBarberos() {

        return userRepository.findByRole(Role.BARBERO)
                .stream()
                .map(userMapper::toUserResponseDTO)
                .toList();
    }

}

