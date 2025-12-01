package co.edu.unicauca.microreservas.capaControladores;

import co.edu.unicauca.microreservas.fachadaServices.DTO.ReservaDTOPeticion;
import co.edu.unicauca.microreservas.fachadaServices.DTO.ReservaDTORespuesta;
import co.edu.unicauca.microreservas.fachadaServices.services.IReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/microReservas")
public class ReservaRestController {

    @Autowired
    private IReservaService reservaService;

    // --- 1. CREAR RESERVA ---
    @PostMapping("/reservas")
    public ResponseEntity<ReservaDTORespuesta> crearReserva(
            @RequestHeader("X-User-Id") Integer idUsuario,
            @RequestHeader("X-User-Email") String emailUsuario,
            @RequestBody ReservaDTOPeticion peticion) {

        ReservaDTORespuesta respuesta = reservaService.crearReserva(idUsuario,emailUsuario, peticion);
        return new ResponseEntity<>(respuesta, HttpStatus.CREATED);
    }

    // --- 2. INICIAR SERVICIO ---
    @PostMapping("/reservas/{id}/iniciar")
    public ResponseEntity<ReservaDTORespuesta> iniciarServicio(
            @PathVariable Integer id,
            @RequestHeader("X-User-Email") String emailUsuario)
    {

        ReservaDTORespuesta respuesta = reservaService.iniciarServicio(id, emailUsuario);
        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

    // --- 3. CANCELAR RESERVA ---
    @PostMapping("/reservas/{id}/cancelar")
    public ResponseEntity<ReservaDTORespuesta> cancelarReserva(
            @PathVariable Integer id,
            @RequestHeader("X-User-Email") String emailUsuario){

        ReservaDTORespuesta respuesta = reservaService.cancelarReserva(id, emailUsuario);
        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

    // --- 4. REPROGRAMAR RESERVA ---
    @PutMapping("/reservas/{id}/reprogramar")
    public ResponseEntity<ReservaDTORespuesta> reprogramarReserva(
            @PathVariable Integer id,
            @RequestHeader("X-User-Email") String emailUsuario,
            @RequestBody ReservaDTOPeticion nuevosDatos) {

        ReservaDTORespuesta respuesta = reservaService.reprogramarReserva(id, emailUsuario, nuevosDatos);
        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

    // --- 5. MARCAR COMPLETADA ---
    @PostMapping("/reservas/{id}/completar")
    public ResponseEntity<ReservaDTORespuesta> marcarCompletada(
            @PathVariable Integer id,
            @RequestHeader("X-User-Email") String emailUsuario) {

        ReservaDTORespuesta respuesta = reservaService.marcarCompletada(id,emailUsuario);
        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

    // --- 6. MARCAR AUSENCIA (No Presentado) ---
    @PostMapping("/reservas/{id}/ausencia")
    public ResponseEntity<ReservaDTORespuesta> marcarNoPresentado(
            @PathVariable Integer id,
            @RequestHeader("X-User-Email") String emailUsuario) {

        ReservaDTORespuesta respuesta = reservaService.marcarNoPresentado(id, emailUsuario);
        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

    // --- 7. LISTAR TODAS ---
    @GetMapping("/reservas")
    public ResponseEntity<List<ReservaDTORespuesta>> listarTodas() {

        List<ReservaDTORespuesta> lista = reservaService.listarTodas();

        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    // --- 8. MIS RESERVAS (Cliente) ---
    // URL: GET /api/v1/microReservas/mis-reservas
    @GetMapping("/mis-reservas")
    public ResponseEntity<List<ReservaDTORespuesta>> listarMisReservas(
            @RequestHeader("X-User-Email") String emailUsuario) {

        List<ReservaDTORespuesta> lista = reservaService.listarPorCliente(emailUsuario);

        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    // --- 9. VER DETALLE RESERVA ---
    // URL: GET /api/v1/microReservas/reservas/{id}
    @GetMapping("/reservas/{id}")
    public ResponseEntity<ReservaDTORespuesta> consultarPorId(@PathVariable Integer id) {

        ReservaDTORespuesta dto = reservaService.consultarPorId(id);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // --- 10. MIS CITAS (Vista Barbero) ---
    // URL: GET /api/v1/microReservas/mis-citas-barbero
    @GetMapping("/mis-citas-barbero")
    public ResponseEntity<List<ReservaDTORespuesta>> listarAgendaBarbero(
            @RequestHeader("X-User-Email") String emailBarbero) {

        List<ReservaDTORespuesta> lista = reservaService.listarAgendaBarbero(emailBarbero);
        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    // --- 11. AGENDA PÚBLICA DE BARBERO (Para el Dashboard Cliente) ---
    // URL: GET /api/v1/microReservas/reservas/barbero/{idBarbero}/hoy
    @GetMapping("/reservas/barbero/{idBarbero}/hoy")
    public ResponseEntity<List<ReservaDTORespuesta>> listarAgendaHoyBarbero(
            @PathVariable Integer idBarbero) {

        List<ReservaDTORespuesta> lista = reservaService.listarAgendaHoyBarbero(idBarbero);

        // Retornamos OK incluso si la lista está vacía (significa que está libre todo el día)
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }
}