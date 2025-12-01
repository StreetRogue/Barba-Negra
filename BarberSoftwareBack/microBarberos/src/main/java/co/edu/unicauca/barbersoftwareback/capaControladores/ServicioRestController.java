package co.edu.unicauca.barbersoftwareback.capaControladores;

import java.util.List;

import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.ServicioDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.ServicioDTORespuesta;
import co.edu.unicauca.barbersoftwareback.fachadaServices.services.IServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/microBarberos")
public class ServicioRestController {

    @Autowired
    private IServicioService servicioService;

    public ServicioRestController(IServicioService servicioService) {
        this.servicioService = servicioService;
    }
    // =========================================================
    // GET: Listar todos los servicios (Admin)
    // =========================================================
    @GetMapping("/servicios")
    public ResponseEntity<List<ServicioDTORespuesta>> listarServicios() {
        return ResponseEntity.ok(servicioService.findAll());
    }


    // =========================================================
    // GET: Buscar servicio por ID
    // =========================================================
    @GetMapping("/servicios/{id}")
    public ResponseEntity<ServicioDTORespuesta> consultarServicio(@PathVariable Integer id) {
        ServicioDTORespuesta servicio = servicioService.findById(id);
        return ResponseEntity.ok(servicio);
    }


    // =========================================================
    // POST: Crear servicio
    // =========================================================
    @PostMapping("/servicios")
    public ResponseEntity<ServicioDTORespuesta> crearServicio(@RequestBody ServicioDTOPeticion servicio) {
        ServicioDTORespuesta creado = servicioService.save(servicio);
        return new ResponseEntity<>(creado, HttpStatus.CREATED);  // 201
    }


    // =========================================================
    // PUT: Actualizar servicio
    // =========================================================
    @PutMapping("/servicios/{id}")
    public ResponseEntity<ServicioDTORespuesta> actualizarServicio(
            @RequestBody ServicioDTOPeticion servicio,
            @PathVariable Integer id
    ) {
        ServicioDTORespuesta actualizado = servicioService.update(id, servicio);
        return ResponseEntity.ok(actualizado);
    }


    // =========================================================
    // DELETE: Eliminar servicio
    // =========================================================
    @DeleteMapping("/servicios/{id}")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Integer id) {
        servicioService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204
    }


    // =========================================================
    // GET: Servicios por categoría (Admin)
    // =========================================================
    @GetMapping("/servicios/categoria/{idCategoria}")
    public ResponseEntity<List<ServicioDTORespuesta>> listarServiciosPorCategoria(
            @PathVariable Integer idCategoria
    ) {
        return ResponseEntity.ok(servicioService.findByCategoria(idCategoria));
    }


    // =========================================================
    // GET: Servicios activos para clientes
    // =========================================================
    @GetMapping("/servicios/cliente")
    public ResponseEntity<List<ServicioDTORespuesta>> listarServiciosActivos() {
        return ResponseEntity.ok(servicioService.findAllClient());
    }


    // =========================================================
    // GET: Servicios activos por categoría (Cliente)
    // =========================================================
    @GetMapping("/servicios/cliente/categoria/{idCategoria}")
    public ResponseEntity<List<ServicioDTORespuesta>> listarServiciosActivosPorCategoria(
            @PathVariable Integer idCategoria
    ) {
        return ResponseEntity.ok(servicioService.findByCategoriaClient(idCategoria));
    }

}
