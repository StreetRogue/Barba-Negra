package co.edu.unicauca.microUsuarios.services;

import co.edu.unicauca.microUsuarios.modelos.Role;
import co.edu.unicauca.microUsuarios.modelos.User;
import co.edu.unicauca.microUsuarios.repositories.UserRepository;
import co.edu.unicauca.microUsuarios.services.Dtos.LoginDTO;
import co.edu.unicauca.microUsuarios.services.Dtos.RegisterBarberoDTO;
import co.edu.unicauca.microUsuarios.services.Dtos.RegisterClienteDTO;
import co.edu.unicauca.microUsuarios.services.exceptions.BadRequestException;
import co.edu.unicauca.microUsuarios.services.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional; // Para lógica de google y correo no google
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // BCrypt

    // ----------------------------------------------------
    // REGISTRO SIN GOOGLE
    // ----------------------------------------------------
    @Transactional
    public User registerClientLocal(RegisterClienteDTO dto) {

        // Validación estricta para registro local
        if (dto.getEmail() == null || dto.getEmail().isEmpty() || dto.getPassword() == null || dto.getPassword().isEmpty()) {
            throw new BadRequestException("El correo y la contraseña son obligatorios.");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("El correo ya esta registrado.");
        }

        User user = User.builder()
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword())) // Se hashea la contraseña
                .telefono(dto.getTelefono())
                .role(Role.CLIENTE)
                .activo(true)
                .build();

        return userRepository.save(user);
    }

    // ----------------------------------------------------
    // REGISTRO CON GOOGLE
    // ----------------------------------------------------
    @Transactional
    public User registerOrRetrieveGoogleUser(RegisterClienteDTO dto) {

        // Busca si el usuario ya existe por su email
        Optional<User> existingUser = userRepository.findByEmail(dto.getEmail());

        // Si el usuario ya existe, devuélvelo
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // Si es un usuario nuevo de Google, lo crea sin contraseña
        User newUser = User.builder()
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                .password(null) // La contraseña es nula para usuarios de Google
                .telefono(dto.getTelefono()) // Generalmente será nulo
                .role(Role.CLIENTE)
                .activo(true)
                .build();

        return userRepository.save(newUser);
    }

    // Login local antes de Auth0
    public User login(LoginDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Correo no encontrado"));

        if (user.getPassword() == null) {
            throw new RuntimeException("Este usuario se registró con Google. Debe iniciar sesión con Google.");
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        return user;
    }


    // -----------------------------------------
    // Consulta de  usuario (admin)
    // -----------------------------------------
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("El usuario con ID " + id + " no existe."));
    }

    // -----------------------------------------
    // Desactivar usuario (admin)
    // -----------------------------------------
    public void desactivarUsuario(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("No se puede desactivar. Usuario con ID " + id + " no existe."));

        user.setActivo(false);
        userRepository.save(user);
    }
    // -----------------------------------------
    // Registrar Barbero (admin)
    // -----------------------------------------
    public User registerBarbero(RegisterBarberoDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("El correo ya está registrado");
        }

        User barbero = User.builder()
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .telefono(dto.getTelefono())
                .role(Role.BARBERO)
                .activo(true)
                .build();

        return userRepository.save(barbero);
    }

}

