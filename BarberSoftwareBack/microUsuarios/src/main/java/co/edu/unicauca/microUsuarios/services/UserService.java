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
    public UserResponseDTO sincronizarUsuario(RegistroUsuarioAuth0DTO dto, String auth0Id, List<String> rolesAuth0) {

        // 1. Buscamos si ya existe por email
        Optional<User> existingUserOpt = userRepository.findByEmail(dto.getEmail());
        User user;

        // 2. Determinamos qué rol dice Auth0 que tiene este usuario
        Role rolDesdeAuth0 = Role.CLIENTE;
        if (rolesAuth0.contains("Admin") || rolesAuth0.contains("ADMIN")) {
            rolDesdeAuth0 = Role.ADMIN;
        } else if (rolesAuth0.contains("Barbero") || rolesAuth0.contains("BARBERO")) {
            rolDesdeAuth0 = Role.BARBERO;
        }

        // 3. Lógica del nombre
        String nombreAUsar = dto.getNombre();
        if (nombreAUsar == null || nombreAUsar.trim().isEmpty()) {
            nombreAUsar = dto.getEmail();
        }

        if (existingUserOpt.isPresent()) {
            // =================================================================
            // CASO 1: El usuario YA EXISTE (Pre-registro Admin o login previo)
            // =================================================================
            user = existingUserOpt.get();

            // --- CORRECCIÓN CRÍTICA AQUÍ ---
            // Si el usuario en la BD ya tiene un rol importante (BARBERO o ADMIN),
            // y Auth0 nos dice que es CLIENTE (o nada), RESPETA EL ROL DE LA BD.
            // Solo actualizamos el rol si en la BD es CLIENTE (así permitimos ascensos futuros).
            if (user.getRole() == Role.CLIENTE) {
                user.setRole(rolDesdeAuth0);
            }
            // Nota: Si en BD es BARBERO y Auth0 dice CLIENTE -> Se queda como BARBERO.
            // -------------------------------

            // Vinculamos la cuenta Auth0 si no estaba vinculada
            if (user.getAuth0Id() == null || !user.getAuth0Id().equals(auth0Id)) {
                user.setAuth0Id(auth0Id);
            }

            // Actualizamos datos básicos solo si vienen en el login y están vacíos en BD
            // (Opcional: puedes decidir sobrescribir siempre la imagen si quieres)
            if (dto.getImagenUrl() != null) {
                user.setImagenUrl(dto.getImagenUrl());
            }

            // No sobrescribas nombre o teléfono si ya existen en BD (preserva lo que puso el Admin)
            if ((user.getNombre() == null || user.getNombre().isEmpty()) && nombreAUsar != null) {
                user.setNombre(nombreAUsar);
            }
            if ((user.getTelefono() == null || user.getTelefono().isEmpty()) && dto.getTelefono() != null) {
                user.setTelefono(dto.getTelefono());
            }

        } else {
            // =================================================================
            // CASO 2: Usuario NUEVO (Registro real desde cero)
            // =================================================================
            user = User.builder()
                    .email(dto.getEmail())
                    .nombre(nombreAUsar)
                    .imagenUrl(dto.getImagenUrl())
                    .auth0Id(auth0Id)
                    .role(rolDesdeAuth0) // Aquí sí usamos lo que diga Auth0 o Cliente por defecto
                    .activo(true)
                    .telefono(dto.getTelefono())
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

    @Transactional(readOnly = true)
    public UserResponseDTO findByEmail(String email) {

        // 1. Buscamos en el repositorio
        User userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND: Usuario con email " + email + " no existe"));

        UserResponseDTO UsuarioToDto = userMapper.toUserResponseDTO(userEntity);
        // 2. Mapeamos a DTO
        return UsuarioToDto;
    }
}



