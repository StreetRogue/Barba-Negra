package co.edu.unicauca.microreservas.capaControladores;

import java.time.LocalDate;
import java.util.List;

import co.edu.unicauca.microreservas.fachadaServices.DTO.SlotDTORespuesta;
import co.edu.unicauca.microreservas.fachadaServices.services.IAgendaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/microReservas")
public class AgendaRestController {

    @Autowired
    private IAgendaService agendaService;

    // Endpoint: Calcular Slots Disponibles
    // Ejemplo URL: GET /api/v1/microReservas/agendas/slots?idBarbero=1&idServicio=2&fecha=2025-11-20
    @GetMapping("/agendas/slots")
    public ResponseEntity<List<SlotDTORespuesta>> obtenerSlotsDisponibles(
            @RequestParam Integer idBarbero,
            @RequestParam Integer idServicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        List<SlotDTORespuesta> slots = agendaService.generarSlots(idBarbero, idServicio, fecha);
        return new ResponseEntity<>(slots, HttpStatus.OK);
    }
}