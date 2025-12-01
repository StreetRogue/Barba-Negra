package co.edu.unicauca.barbersoftwareback.capaControladores;

import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoDTORespuesta;
import co.edu.unicauca.barbersoftwareback.fachadaServices.services.IBarberoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/microBarberos")
public class BarberoRestController {

    private final IBarberoService barberoService;

    public BarberoRestController(IBarberoService barberoService) {
        this.barberoService = barberoService;
    }

    @GetMapping("/barberos")
    public ResponseEntity<List<BarberoDTORespuesta>> listarBarberos() {
        List<BarberoDTORespuesta> lista = barberoService.findAll();
        return ResponseEntity.ok(lista); // 200 OK
    }

    @GetMapping("/barberos/{id}")
    public ResponseEntity<BarberoDTORespuesta> buscarPorId(@PathVariable Integer id) {
        BarberoDTORespuesta dto = barberoService.findById(id);
        return ResponseEntity.ok(dto); // 200 OK
    }

    @GetMapping("/barberos/nombre/{nombre}")
    public ResponseEntity<BarberoDTORespuesta> buscarPorNombre(@PathVariable String nombre) {
        BarberoDTORespuesta dto = barberoService.findByNombre(nombre);
        return ResponseEntity.ok(dto); // 200 OK
    }

    @GetMapping("/barberos/estado/{estado}")
    public ResponseEntity<List<BarberoDTORespuesta>> buscarPorEstado(@PathVariable String estado) {
        List<BarberoDTORespuesta> lista = barberoService.findByEstado(estado);
        return ResponseEntity.ok(lista); // 200 OK
    }

    @PostMapping("/barberos")
    public ResponseEntity<BarberoDTORespuesta> crearBarbero(@RequestBody BarberoDTOPeticion dto) {
        BarberoDTORespuesta creado = barberoService.save(dto);
        return ResponseEntity.status(201).body(creado); // 201 CREATED
    }

    @PutMapping("/actualizarBarbero/{id}")
    public ResponseEntity<BarberoDTORespuesta> actualizar(
            @PathVariable Integer id,
            @RequestBody BarberoDTOPeticion dto
    ) {
        BarberoDTORespuesta updated = barberoService.update(id, dto);
        return ResponseEntity.ok(updated); // 200 OK
    }

}
