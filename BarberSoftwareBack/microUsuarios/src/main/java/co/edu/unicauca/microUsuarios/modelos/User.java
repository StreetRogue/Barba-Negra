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

    @Column(name = "auth0_id", unique = true, nullable = true)
    private String auth0Id;

    @Column(nullable = false, unique = true)
    private String email;

    // Imagen obtenida desde Google
    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(nullable = false)
    private String nombre;

    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Boolean activo = true;
}