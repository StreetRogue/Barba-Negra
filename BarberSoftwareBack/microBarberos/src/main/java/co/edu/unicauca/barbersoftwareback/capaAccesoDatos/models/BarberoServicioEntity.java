package co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "barbero_servicios",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"barbero_id", "servicio_id"})})
public class BarberoServicioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "barbero_id", nullable = false)
    private BarberoEntity barbero;

    @ManyToOne(optional = false)
    @JoinColumn(name = "servicio_id", nullable = false)
    private ServicioEntity servicio;
}