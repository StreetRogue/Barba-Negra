package co.edu.unicauca.microreservas.capaAccesoDatos.models;

import jakarta.persistence.*;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "agenda_diaria")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AgendaDiariaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agenda")
    private Integer idAgenda;

    @Column(name = "id_barbero", nullable = false)
    private Integer idBarbero;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    // Relación con ReservaEntity
    @OneToMany(mappedBy = "agenda", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReservaEntity> reservas;
}
