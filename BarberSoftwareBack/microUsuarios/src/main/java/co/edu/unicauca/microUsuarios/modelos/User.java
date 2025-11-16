package co.edu.unicauca.microUsuarios.modelos;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Más adelante se elimina si usas Auth0-only login

    @Column(nullable = false)
    private String nombre;

    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;    // ADMIN, BARBERO, CLIENTE

    @Column(nullable = false)
    private Boolean activo = true;
}