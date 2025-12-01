package co.edu.unicauca.micronotificaciones.repositories;


import co.edu.unicauca.micronotificaciones.models.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    /**
     * Consulta todas las notificaciones de un usuario específico, ordenadas por fecha descendente.
     * Esto se usa para cargar el historial de notificaciones en el frontend.
     */
    List<Notificacion> findByIdUsuarioOrderByFechaCreacionDesc(Long idUsuario);

    /**
     * Consulta el conteo de notificaciones no leídas de un usuario.
     * Esto se usa para el contador del "punto rojo" en la interfaz.
     */
    long countByIdUsuarioAndLeidoFalse(Long idUsuario);

    /**
     * Busca las notificaciones por ID de usuario, ordenadas por fecha de creación descendente,
     * y limitadas a las primeras N (Spring Data lo maneja con 'TopN').
     */
    List<Notificacion> findTop5ByIdUsuarioOrderByFechaCreacionDesc(Long idUsuario);

}
