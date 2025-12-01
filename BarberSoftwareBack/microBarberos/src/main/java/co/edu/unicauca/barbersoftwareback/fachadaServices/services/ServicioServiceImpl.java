package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.CategoriaEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.ServicioEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.CategoriaRepository;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.ServicioRepository;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.ServicioDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.ServicioDTORespuesta;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ServicioServiceImpl implements IServicioService {

    private final ServicioRepository servicioRepository;
    private final CategoriaRepository categoriaRepository;
    private final ModelMapper modelMapper;

    public ServicioServiceImpl(
            ServicioRepository servicioRepository,
            CategoriaRepository categoriaRepository,
            ModelMapper modelMapper
    ) {
        this.servicioRepository = servicioRepository;
        this.categoriaRepository = categoriaRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServicioDTORespuesta> findAll() {
        return servicioRepository.findAll()
                .stream()
                .map(s -> modelMapper.map(s, ServicioDTORespuesta.class))
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public ServicioDTORespuesta findById(Integer id) {
        return servicioRepository.findById(id)
                .map(s -> modelMapper.map(s, ServicioDTORespuesta.class))
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));
    }


    @Override
    @Transactional
    public ServicioDTORespuesta save(ServicioDTOPeticion dto) {

        //Validaciones de cada campo del post

        if (dto == null) {throw new RuntimeException("BAD_REQUEST");}

        if (dto.getNombre() == null || dto.getNombre().isBlank()) {throw new RuntimeException("BAD_REQUEST");}

        if (dto.getDescripcion() == null || dto.getDescripcion().isBlank()) {throw new RuntimeException("BAD_REQUEST");}

        if (dto.getPrecio() == null ||dto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {throw new RuntimeException("BAD_REQUEST");}

        if (dto.getDuracionMinutos() == null || dto.getDuracionMinutos() <= 0) {throw new RuntimeException("BAD_REQUEST");}

        if (dto.getCategoria() == null || dto.getCategoria().getId() == null) {throw new RuntimeException("BAD_REQUEST");}


        // Validar Nombre Duplicado
        if (servicioRepository.existsByNombre(dto.getNombre())) {throw new RuntimeException("CONFLICT");}


        CategoriaEntity categoria  = categoriaRepository.findById(dto.getCategoria().getId())
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));


        ServicioEntity entity = modelMapper.map(dto, ServicioEntity.class);
        entity.setFechaCreacion(LocalDateTime.now());


        if (entity.getEstado() == null || entity.getEstado().isBlank()) {
            entity.setEstado("Activo");
        }


        if (dto.getImagenBase64() != null) {
            entity.setImagenBase64(dto.getImagenBase64());
        }

        entity.setCategoria(categoria);

        ServicioEntity guardado = servicioRepository.save(entity);

        return modelMapper.map(guardado, ServicioDTORespuesta.class);
    }


    @Override
    @Transactional
    public ServicioDTORespuesta update(Integer id, ServicioDTOPeticion dto) {

        ServicioEntity entity = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Validaciones básicas de formato (BAD_REQUEST)
        if (dto.getNombre() != null && dto.getNombre().isBlank()) { throw new RuntimeException("BAD_REQUEST"); }
        if (dto.getDescripcion() != null && dto.getDescripcion().isBlank()) { throw new RuntimeException("BAD_REQUEST"); }
        if (dto.getPrecio() != null && dto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) { throw new RuntimeException("BAD_REQUEST"); }
        if (dto.getDuracionMinutos() != null && dto.getDuracionMinutos() <= 0) { throw new RuntimeException("BAD_REQUEST"); }

        // --- CORRECCIÓN AQUÍ (Lógica de Nombre Único) ---
        if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
            // 1. ¿El nombre cambió?
            if (!dto.getNombre().equals(entity.getNombre())) {
                // 2. Si cambió, ¿ya lo está usando otro servicio?
                if (servicioRepository.existsByNombre(dto.getNombre())) {
                    throw new RuntimeException("CONFLICT");
                }
                // Si no lo usa nadie, lo actualizamos
                entity.setNombre(dto.getNombre());
            }
            // Si el nombre NO cambió, no hacemos nada (se conserva el mismo) y no salta error.
        }
        // --------------------------------------------------

        if (dto.getDescripcion() != null) entity.setDescripcion(dto.getDescripcion());

        // Validación BigDecimal > 0
        if (dto.getPrecio() != null && dto.getPrecio().compareTo(BigDecimal.ZERO) > 0) {
            entity.setPrecio(dto.getPrecio());
        }

        if (dto.getDuracionMinutos() != null && dto.getDuracionMinutos() > 0) {
            entity.setDuracionMinutos(dto.getDuracionMinutos());
        }

        if (dto.getImagenBase64() != null) {
            entity.setImagenBase64(dto.getImagenBase64());
        }

        if (dto.getEstado() != null && !dto.getEstado().isBlank()) {
            entity.setEstado(dto.getEstado());
        }

        if (dto.getCategoria() != null) {
            // Recuerda que aquí habíamos acordado usar solo el ID (dto.getIdCategoria())
            // Pero si sigues usando el objeto anidado, esta lógica es válida:
            if (dto.getCategoria().getId() != null) {
                CategoriaEntity categoria = categoriaRepository.findById(dto.getCategoria().getId())
                        .orElseThrow(() -> new RuntimeException("NOT_FOUND"));
                entity.setCategoria(categoria);
            }
        }

        ServicioEntity actualizado = servicioRepository.save(entity);

        return modelMapper.map(actualizado, ServicioDTORespuesta.class);
    }

    @Override
    @Transactional
    public boolean delete(Integer id) {
        if (!servicioRepository.existsById(id)) {
            throw new RuntimeException("NOT_FOUND");
        }
        servicioRepository.deleteById(id);
        return true;
    }


    @Override
    @Transactional(readOnly = true)
    public List<ServicioDTORespuesta> findByCategoria(Integer idCategoria) {
        return servicioRepository.findByCategoria_Id(idCategoria)
                .stream()
                .map(s -> modelMapper.map(s, ServicioDTORespuesta.class))
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public List<ServicioDTORespuesta> findAllClient() {
        return servicioRepository.findByEstado("Activo")
                .stream()
                .map(s -> modelMapper.map(s, ServicioDTORespuesta.class))
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public List<ServicioDTORespuesta> findByCategoriaClient(Integer idCategoria) {
        return servicioRepository.findByCategoria_IdAndEstado(idCategoria, "Activo")
                .stream()
                .map(s -> modelMapper.map(s, ServicioDTORespuesta.class))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ServicioDTORespuesta findByNombre(String nombre) {

        // Usamos .orElseThrow() porque el repo devuelve Optional
        ServicioEntity entity = servicioRepository.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        return modelMapper.map(entity, ServicioDTORespuesta.class);

    }
}
