package co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "barberos")
public class BarberoEntity {

    @Id
    private Integer id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(nullable = false, length = 15)
    private String telefono;

    @Column(nullable = false, length = 20)
    private String estado;  // ACTIVO / INACTIVO

    // Relación Bidireccional: Si borras al barbero, se borran sus horarios.
    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<HorarioLaboralEntity> horarios;
}
