package co.edu.unicauca.microreservas.capaAccesoDatos.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_reservas")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HistorialReservaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Integer idHistorial;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reserva", nullable = false)
    private ReservaEntity reserva;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_guardado", nullable = false)
    private EstadoReservaEnum estadoGuardado;

    @Column(name = "fecha_cambio", nullable = false)
    private LocalDateTime fechaCambio;
}