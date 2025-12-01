package co.edu.unicauca.barbersoftwareback.capaControladores;

import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoServicioDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoServicioDTORespuesta;
import co.edu.unicauca.barbersoftwareback.fachadaServices.services.IBarberoServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/microBarberos")
public class BarberoServicioRestController {

    @Autowired
    private IBarberoServicioService barberoServicioService;

    // Asignar un barbero a un servicio

    @PostMapping("/barberoServicio")
    public ResponseEntity<BarberoServicioDTORespuesta> asignarBarbero(
            @RequestBody BarberoServicioDTOPeticion dto
    ) {
        BarberoServicioDTORespuesta creado = barberoServicioService.assignBarberoToServicio(dto);
        return new ResponseEntity<>(creado, HttpStatus.CREATED);
    }

    // Listar todos los barberos de un servicio (ej: Quiénes hacen 'Corte')

    @GetMapping("/barberoServicio/servicio/{servicioId}")
    public ResponseEntity<List<BarberoServicioDTORespuesta>> listarBarberosPorServicio(
            @PathVariable Integer servicioId
    ) {
        List<BarberoServicioDTORespuesta> lista = barberoServicioService.listBarberosByServicio(servicioId);
        return ResponseEntity.ok(lista);
    }


    // Listar todos los servicios de un barbero

    @GetMapping("/barberoServicio/barbero/{barberoId}")
    public ResponseEntity<List<BarberoServicioDTORespuesta>> listarServiciosPorBarbero(
            @PathVariable Integer barberoId
    ) {
        List<BarberoServicioDTORespuesta> lista = barberoServicioService.listServiciosByBarbero(barberoId);
        return ResponseEntity.ok(lista);
    }

    // Quitar servicio a un barbero

    @DeleteMapping("/barberoServicio/barbero/{barberoId}/servicio/{servicioId}")
    public ResponseEntity<Void> eliminarBarberoServicio(
            @PathVariable Integer barberoId,
            @PathVariable Integer servicioId
    ) {
        barberoServicioService.desasignarServicio(barberoId, servicioId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}