package co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "horariosLaborales")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HorarioLaboralEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 1=Lunes, 2=Martes... 7=Domingo
    @Column(nullable = false)
    private Integer diaSemana;

    @Column(nullable = true)
    private LocalTime horaInicio;

    @Column(nullable = true)
    private LocalTime horaFin;

    @Column(nullable = false)
    private Boolean esDiaLibre;

    // Relación de vuelta al Barbero
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barbero_id", nullable = false)
    private BarberoEntity barbero;
}

