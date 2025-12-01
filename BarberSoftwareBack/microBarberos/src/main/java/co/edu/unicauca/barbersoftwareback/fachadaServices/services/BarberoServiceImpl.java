package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.BarberoEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.BarberoRepository;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoDTORespuesta;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BarberoServiceImpl implements IBarberoService {

    private final BarberoRepository barberoRepository;
    private final ModelMapper modelMapper;

    public BarberoServiceImpl(BarberoRepository barberoRepository, ModelMapper modelMapper) {
        this.barberoRepository = barberoRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarberoDTORespuesta> findAll() {
        List<BarberoEntity> lista = barberoRepository.findAll();

        if (lista.isEmpty()) {
            throw new RuntimeException("NOT_FOUND");
        }

        return lista.stream()
                .map(barbero -> modelMapper.map(barbero, BarberoDTORespuesta.class))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BarberoDTORespuesta findById(Integer id) {
        BarberoEntity entity = barberoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        return modelMapper.map(entity, BarberoDTORespuesta.class);
    }

    @Override
    @Transactional(readOnly = true)
    public BarberoDTORespuesta findByNombre(String nombre) {
        BarberoEntity entity = barberoRepository.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        return modelMapper.map(entity, BarberoDTORespuesta.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarberoDTORespuesta> findByEstado(String estado) {
        List<BarberoEntity> lista = barberoRepository.findByEstado(estado);

        if (lista.isEmpty()) {
            throw new RuntimeException("NOT_FOUND");
        }

        return lista.stream()
                .map(entity -> modelMapper.map(entity, BarberoDTORespuesta.class))
                .toList();
    }

    @Override
    @Transactional
    public BarberoDTORespuesta save(BarberoDTOPeticion dto) {

        //Validaciones de cada campo de la peticion

        if (dto == null) throw new RuntimeException("BAD_REQUEST");

        if (dto.getId() == null) throw new RuntimeException("BAD_REQUEST");

        if (dto.getNombre() == null || dto.getNombre().isBlank()) throw new RuntimeException("BAD_REQUEST");

        if (dto.getEmail() == null || dto.getEmail().isBlank()) throw new RuntimeException("BAD_REQUEST");

        if (dto.getTelefono() == null || dto.getTelefono().isBlank()) throw new RuntimeException("BAD_REQUEST");

        // Validar el id  y email existentes
        if (barberoRepository.existsById(dto.getId())) {throw new RuntimeException("CONFLICT");}

        if (barberoRepository.existsByEmail(dto.getEmail())) {throw new RuntimeException("CONFLICT");}


        BarberoEntity barbero = modelMapper.map(dto, BarberoEntity.class);


        if (dto.getEstado() == null || dto.getEstado().isBlank()) {
            barbero.setEstado("Activo");
        }

        BarberoEntity savedBarbero = barberoRepository.save(barbero);

        return modelMapper.map(savedBarbero, BarberoDTORespuesta.class);
    }


    @Override
    @Transactional // Escritura
    public BarberoDTORespuesta update(Integer id, BarberoDTOPeticion dto) { // ID Integer

        if (dto == null) throw new RuntimeException("BAD_REQUEST");

        BarberoEntity entity = barberoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Validación consistencia ID
        if (dto.getId() != null && !dto.getId().equals(id)) {
            throw new RuntimeException("BAD_REQUEST");
        }

        if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
            entity.setNombre(dto.getNombre());
        }

        // Optimización: Solo validar email si cambió
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            if (!entity.getEmail().equals(dto.getEmail())) {
                if (barberoRepository.existsByEmail(dto.getEmail())) {
                    throw new RuntimeException("CONFLICT");
                }
                entity.setEmail(dto.getEmail());
            }
        }

        if (dto.getTelefono() != null && !dto.getTelefono().isBlank()) {
            entity.setTelefono(dto.getTelefono());
        }

        if (dto.getEstado() != null) {
            if (dto.getEstado().isBlank()) {
                entity.setEstado("Activo");
            } else {
                entity.setEstado(dto.getEstado());
            }
        }

        BarberoEntity actualizado = barberoRepository.save(entity);
        return modelMapper.map(actualizado, BarberoDTORespuesta.class);
    }

}
