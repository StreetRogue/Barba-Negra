package co.edu.unicauca.microreservas.capaControladores;

import co.edu.unicauca.microreservas.fachadaServices.DTO.HistorialReservaDTORespuesta;
import co.edu.unicauca.microreservas.fachadaServices.DTO.ReporteDTOPeticion;
import co.edu.unicauca.microreservas.fachadaServices.DTO.ReporteDTORespuesta;
import co.edu.unicauca.microreservas.fachadaServices.services.IReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/microReservas/reportes")
public class ReporteRestController {

    @Autowired
    private IReporteService reporteService;

    /**
     * Endpoint para generar estadísticas (KPIs).
     * Ejemplo URL: GET /api/v1/microReservas/reportes/kpi?fechaInicio=2025-01-01&fechaFin=2025-01-31&idBarbero=1
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<ReporteDTORespuesta> obtenerReporteKpi(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) Integer idBarbero,
            @RequestParam(required = false) Integer idServicio
    ) {
        // 1. Construimos el DTO de Petición con los parámetros de la URL
        ReporteDTOPeticion peticion = ReporteDTOPeticion.builder()
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .idBarbero(idBarbero)
                .idServicio(idServicio)
                .build();

        // 2. Llamamos al servicio
        ReporteDTORespuesta respuesta = reporteService.generarReporte(peticion);

        // 3. Retornamos OK
        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

    /**
     * Endpoint para ver la auditoría de una reserva (Memento).
     * Ejemplo URL: GET /api/v1/microReservas/reportes/historial/105
     */
    @GetMapping("/historial/{idReserva}")
    public ResponseEntity<List<HistorialReservaDTORespuesta>> obtenerHistorialReserva(
            @PathVariable Integer idReserva
    ) {
        List<HistorialReservaDTORespuesta> historial = reporteService.consultarHistorial(idReserva);
        return new ResponseEntity<>(historial, HttpStatus.OK);
    }
}