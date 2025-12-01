package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.CategoriaDTORespuesta;

import java.util.List;

public interface ICategoriaService {
    public List<CategoriaDTORespuesta> findAll();
}
