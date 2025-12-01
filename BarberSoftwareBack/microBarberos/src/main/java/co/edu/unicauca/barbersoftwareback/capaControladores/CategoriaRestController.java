package co.edu.unicauca.barbersoftwareback.capaControladores;

import java.util.List;

import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.CategoriaDTORespuesta;
import co.edu.unicauca.barbersoftwareback.fachadaServices.services.ICategoriaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/microBarberos")
public class CategoriaRestController {

    @Autowired
    private ICategoriaService categoriaService;

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaDTORespuesta>> listarCategorias() {
        List<CategoriaDTORespuesta> categorias = categoriaService.findAll();
        return new ResponseEntity<>(categorias, HttpStatus.OK);
    }

}
