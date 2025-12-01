package co.edu.unicauca.barbersoftwareback.capaControladores;

import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.HorarioLaboralDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.HorarioLaboralDTORespuesta;
import co.edu.unicauca.barbersoftwareback.fachadaServices.services.IHorarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/microBarberos")
public class HorarioRestController {

    private final IHorarioService horarioService;

    public HorarioRestController(IHorarioService horarioService) {
        this.horarioService = horarioService;
    }

    // 1. Obtener la semana completa de un barbero
    @GetMapping("/barbero/{barberoId}/horarios")
    public ResponseEntity<List<HorarioLaboralDTORespuesta>> listarHorariosPorBarbero(@PathVariable Integer barberoId) {
        List<HorarioLaboralDTORespuesta> semana = horarioService.findByBarberoId(barberoId);
        return ResponseEntity.ok(semana);
    }

    // 2. Crear Horario
    @PostMapping("/horarios/configuracion-semanal")
    public ResponseEntity<List<HorarioLaboralDTORespuesta>> crearHorario(
            @RequestBody List<HorarioLaboralDTOPeticion> listaDtos
    ) {
        List<HorarioLaboralDTORespuesta> respuesta = horarioService.crearHorario(listaDtos);
        return ResponseEntity.ok(respuesta);
    }

    // Actualizar un día específico
    @PutMapping("/horarios/{id}")
    public ResponseEntity<HorarioLaboralDTORespuesta> actualizarDia(
            @PathVariable Integer id,
            @RequestBody HorarioLaboralDTOPeticion dto
    ) {
        return ResponseEntity.ok(horarioService.update(id, dto));
    }

}