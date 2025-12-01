package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import java.util.List;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.CategoriaEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.CategoriaRepository;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.CategoriaDTORespuesta;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoriaServiceImpl implements ICategoriaService {

    private final CategoriaRepository servicioAccesoBaseDatos;
    private final ModelMapper modelMapper;

    public CategoriaServiceImpl(CategoriaRepository servicioAccesoBaseDatos, ModelMapper modelMapper) {
        this.servicioAccesoBaseDatos = servicioAccesoBaseDatos;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaDTORespuesta> findAll() {
        List<CategoriaEntity> categorias = servicioAccesoBaseDatos.findAll();

        if (categorias.isEmpty()) {
            throw new RuntimeException("NOT_FOUND");
        }

        return modelMapper.map(
                categorias,
                new TypeToken<List<CategoriaDTORespuesta>>() {}.getType()
        );
    }
}
