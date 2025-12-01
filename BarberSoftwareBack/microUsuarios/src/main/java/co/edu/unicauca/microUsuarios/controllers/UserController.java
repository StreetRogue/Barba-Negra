package co.edu.unicauca.microUsuarios.controllers;

import co.edu.unicauca.microUsuarios.mappers.UserMapper;
import co.edu.unicauca.microUsuarios.modelos.User;
import co.edu.unicauca.microUsuarios.services.Dtos.*;
import co.edu.unicauca.microUsuarios.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ---------------------------
    // SINCRONIZACIÓN (Login/Registro)
    // ---------------------------
    // Este endpoint recibe el token de Auth0, extrae el ID (sub) y
    // busca o crea al usuario en tu BD.
    @PostMapping("/sincronizar")
    public ResponseEntity<UserResponseDTO> sincronizar(
            @RequestBody RegistroUsuarioAuth0DTO dto,
            @AuthenticationPrincipal Jwt jwt) { // <-- Auth0 inyecta el token aquí

        // Extraemos el ID seguro de Auth0 (ej: "google-oauth2|12345...")
        String auth0Id = jwt.getSubject();
        List<String> rolesAuth0 = jwt.getClaimAsStringList("https://BarbaNegra.com/roles");

        if (rolesAuth0 == null) {
            rolesAuth0 = List.of();
        }

        UserResponseDTO response = userService.sincronizarUsuario(dto, auth0Id, rolesAuth0);
        return ResponseEntity.ok(response);
    }

    // ---------------------------
    // Registrar Barbero (Solo Admin)
    // ---------------------------
    @PostMapping("/registro-barbero")
    public ResponseEntity<BarberResponseDTO> registerBarbero(@RequestBody RegisterBarberoDTO dto) {
        BarberResponseDTO response = userService.registerBarbero(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ---------------------------
    // Obtener usuario por ID
    // (Útil para validaciones o desde Gateway)
    // ---------------------------
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {

        UserResponseDTO response = userService.getUserById(id);
        return ResponseEntity
                .ok(response);
    }

    // ---------------------------
    // DESACTIVAR USUARIO
    // (Solo Admin lo llamaría)
    // ---------------------------
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {

        userService.desactivarUsuario(id);

        return ResponseEntity.noContent().build();
    }


    // ---------------------------
    // LISTAR BARBEROS
    // (Solo Admin lo llamaría)
    // ---------------------------
    @GetMapping("/barberos")
    public ResponseEntity<List<UserResponseDTO>> getBarberos() {

        List<UserResponseDTO> barberos = userService.listarBarberos();
        return ResponseEntity.ok(barberos);
    }

    // GET /api/v1/usuarios/buscar?email=juan@gmail.com
    @GetMapping("/buscar")
    public ResponseEntity<UserResponseDTO> getUserByEmail(@RequestParam String email) {
        // Asumo que tu servicio tiene un método findByEmail
        UserResponseDTO response = userService.findByEmail(email);
        return ResponseEntity.ok(response);
    }




}


