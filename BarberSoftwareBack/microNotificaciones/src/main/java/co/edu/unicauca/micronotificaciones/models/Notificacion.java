package co.edu.unicauca.micronotificaciones.models;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificacion")
@Getter
@Setter
@NoArgsConstructor // Reemplaza tu constructor vacío
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNotificacion;

    private Long idUsuario; // Destinatario (Cliente o Barbero)

    private Long idReserva; // Opcional, pero bueno para trazabilidad

    @Column(columnDefinition = "TEXT")
    private String mensaje; // El contenido de la notificación

    private Boolean leido = false; // Por defecto: no leído

    private LocalDateTime fechaCreacion = LocalDateTime.now();

    private String tipo; // Ejemplo: RECORDATORIO_1H, RECORDATORIO_10M, RESERVA_CONFIRMADA

    // Constructor simplificado para la lógica de guardado de notificaciones programadas
    public Notificacion(Long idUsuario, String mensaje, String tipo, Long idReserva) {
        this.idUsuario = idUsuario;
        this.mensaje = mensaje;
        this.tipo = tipo;
        this.idReserva = idReserva;
    }

    public String getMensaje() {
        return mensaje;
    }
}
