package co.edu.unicauca.microreservas.capaAccesoDatos.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reserva")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Integer idReserva;

    // Esta es la relación que completa el círculo con AgendaDiariaEntity
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_agenda", nullable = false)
    private AgendaDiariaEntity agenda;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "id_servicio", nullable = false)
    private Integer idServicio;

    @Column(name = "hora_inicio", nullable = false)
    private LocalDateTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalDateTime horaFin;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoReservaEnum estado;

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<HistorialReservaEntity> historial;

    @Column(name = "id_transaccion_pago")
    private String idTransaccion;

    // ==========================================
    // IMPLEMENTACIÓN PATRÓN MEMENTO (Originator)
    // ==========================================

    /**
     * Crea una "foto" del estado actual para guardarla en el historial.
     * Este objeto (HistorialReservaEntity) es el Memento.
     */
    public HistorialReservaEntity guardarMemento() {
        return HistorialReservaEntity.builder()
                .reserva(this)                // Referencia a mí mismo
                .estadoGuardado(this.estado)  // Guardo mi estado actual (Snapshot)
                .fechaCambio(LocalDateTime.now()) // Guardo cuándo ocurrió
                .build();
    }
}