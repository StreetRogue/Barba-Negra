package co.edu.unicauca.micronotificaciones.controllers;

import co.edu.unicauca.micronotificaciones.models.Notificacion;
import co.edu.unicauca.micronotificaciones.repositories.NotificacionRepository;
import co.edu.unicauca.micronotificaciones.services.NotificacionFacade;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notificaciones")
public class NotificacionController {

    private final NotificacionFacade fachadaNotificacion;


    public NotificacionController(NotificacionFacade fachadaNotificacion) {
        this.fachadaNotificacion = fachadaNotificacion;
    }

    /**
     * Endpoint para obtener el historial de notificaciones.
     * URL: GET /api/notificaciones/{userId}/historial
     * Retorna las últimas 5 notificaciones persistidas para ese usuario.
     */
    @GetMapping("/{userId}/historial")
    public ResponseEntity<List<Notificacion>> getHistorial(@PathVariable Long userId) {

        System.out.println("Consulta de Historial solicitada para el usuario: " + userId);

        // 1. Obtener la lista (puede ser vacía)
        List<Notificacion> historial = fachadaNotificacion.obtener5NotificacionesDeCliente(userId);

        // 2. Devolver ResponseEntity con la lista y status 200 OK.
        // Si la lista está vacía, se devuelve [] con status 200, lo cual es el comportamiento estándar y correcto.
        return ResponseEntity.ok(historial);}
}
