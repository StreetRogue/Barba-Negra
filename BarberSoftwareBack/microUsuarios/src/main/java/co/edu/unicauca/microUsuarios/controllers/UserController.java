package co.edu.unicauca.microUsuarios.controllers;

import co.edu.unicauca.microUsuarios.modelos.User;
import co.edu.unicauca.microUsuarios.services.Dtos.LoginDTO;
import co.edu.unicauca.microUsuarios.services.Dtos.RegisterBarberoDTO;
import co.edu.unicauca.microUsuarios.services.Dtos.RegisterClienteDTO;
import co.edu.unicauca.microUsuarios.services.Dtos.UserResponseDTO;
import co.edu.unicauca.microUsuarios.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ---------------------------
    // Registro de Cliente Sin Google
    // ---------------------------
    @PostMapping("/registro")
    public ResponseEntity<UserResponseDTO> registerClientLocal(@RequestBody RegisterClienteDTO dto) {

        User saved = userService.registerClientLocal(dto);
        UserResponseDTO response = toDTO(saved);

        return ResponseEntity
                .status(HttpStatus.CREATED)  // 201 Create
                .body(response);
    }

    // ---------------------------
    // Registro de Cliente Con Google
    // ---------------------------
    @PostMapping("/registro-google")
    public ResponseEntity<UserResponseDTO> registerClientGoogle(@RequestBody RegisterClienteDTO dto) {
        User savedOrRetrieved = userService.registerOrRetrieveGoogleUser(dto);
        // Usamos OK (200) porque puede ser una creación o una obtención
        return ResponseEntity.ok(toDTO(savedOrRetrieved));
    }

    // ---------------------------
    // Login Local (para pruebas)
    // *Este luego será reemplazado por Auth0*
    // ---------------------------
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody LoginDTO dto) {

        User user = userService.login(dto);
        UserResponseDTO response = toDTO(user);

        return ResponseEntity
                .ok(response); // 200 OK
    }

    // ---------------------------
    // Obtener usuario por ID
    // (Útil para validaciones o desde Gateway)
    // ---------------------------
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {

        User user = userService.getUserById(id);
        return ResponseEntity
                .ok(toDTO(user));
    }

    // ---------------------------
    // DESACTIVAR USUARIO
    // (Solo Admin lo llamaría)
    // ---------------------------
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {

        userService.desactivarUsuario(id);

        return ResponseEntity
                .noContent()   // 204 No Content
                .build();
    }

    @PostMapping("/registro-barbero")
    public ResponseEntity<UserResponseDTO> registerBarbero(@RequestBody RegisterBarberoDTO dto) {

        User saved = userService.registerBarbero(dto);
        UserResponseDTO response = toDTO(saved);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }



    // ---------------------------
    // Convertir entidad → DTO
    // ---------------------------
    private UserResponseDTO toDTO(User u) {
        return new UserResponseDTO(
                u.getId(),
                u.getEmail(),
                u.getNombre(),
                u.getTelefono(),
                u.getRole()
        );
    }
}


