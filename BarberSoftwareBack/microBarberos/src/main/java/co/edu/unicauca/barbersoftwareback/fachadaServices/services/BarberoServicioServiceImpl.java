package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.BarberoEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.BarberoServicioEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.ServicioEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.BarberoRepository;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.BarberoServicioRepository;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.ServicioRepository;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoServicioDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.BarberoServicioDTORespuesta;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BarberoServicioServiceImpl implements IBarberoServicioService {

    private final BarberoServicioRepository barberoServicioRepository;
    private final BarberoRepository barberoRepository;
    private final ServicioRepository servicioRepository;
    private final ModelMapper modelMapper;

    public BarberoServicioServiceImpl(
            BarberoServicioRepository barberoServicioRepository,
            BarberoRepository barberoRepository,
            ServicioRepository servicioRepository,
            ModelMapper modelMapper // Inyectamos tu Bean
    ) {
        this.barberoServicioRepository = barberoServicioRepository;
        this.barberoRepository = barberoRepository;
        this.servicioRepository = servicioRepository;
        this.modelMapper = modelMapper;

        // --- CONFIGURACIÓN DEL MAPPER (Solo se hace una vez aquí) ---
        // Le enseñamos a "aplanar" los objetos:
        this.modelMapper.typeMap(BarberoServicioEntity.class, BarberoServicioDTORespuesta.class)
                .addMapping(src -> src.getBarbero().getId(), BarberoServicioDTORespuesta::setBarberoId)
                .addMapping(src -> src.getBarbero().getNombre(), BarberoServicioDTORespuesta::setNombreBarbero)
                .addMapping(src -> src.getServicio().getId(), BarberoServicioDTORespuesta::setServicioId)
                .addMapping(src -> src.getServicio().getNombre(), BarberoServicioDTORespuesta::setNombreServicio);
    }

    @Override
    @Transactional
    public BarberoServicioDTORespuesta assignBarberoToServicio(BarberoServicioDTOPeticion dto) {

        if (dto == null) throw new RuntimeException("BAD_REQUEST");
        if (dto.getBarberoId() == null || dto.getServicioId() == null) throw new RuntimeException("BAD_REQUEST");

        // Validación ID Integer
        if (barberoServicioRepository.existsByBarbero_IdAndServicio_Id(dto.getBarberoId(), dto.getServicioId())) {
            throw new RuntimeException("CONFLICT");
        }

        // Buscamos entidades
        BarberoEntity barbero = barberoRepository.findById(dto.getBarberoId())
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        ServicioEntity servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        BarberoServicioEntity entity = new BarberoServicioEntity();
        entity.setBarbero(barbero);
        entity.setServicio(servicio);

        BarberoServicioEntity saved = barberoServicioRepository.save(entity);

        // ¡Mapeo Automático!
        return modelMapper.map(saved, BarberoServicioDTORespuesta.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarberoServicioDTORespuesta> listBarberosByServicio(Integer servicioId) {
        if (!servicioRepository.existsById(servicioId)) {
            throw new RuntimeException("NOT_FOUND");
        }

        List<BarberoServicioEntity> lista = barberoServicioRepository.findByServicio_Id(servicioId);

        return lista.stream()
                .map(entity -> modelMapper.map(entity, BarberoServicioDTORespuesta.class))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarberoServicioDTORespuesta> listServiciosByBarbero(Integer barberoId) {
        if (!barberoRepository.existsById(barberoId)) {
            throw new RuntimeException("NOT_FOUND");
        }

        List<BarberoServicioEntity> lista = barberoServicioRepository.findByBarbero_Id(barberoId);

        return lista.stream()
                .map(entity -> modelMapper.map(entity, BarberoServicioDTORespuesta.class))
                .toList();
    }

    @Override
    @Transactional
    public boolean desasignarServicio(Integer barberoId, Integer servicioId) {
        if (!barberoServicioRepository.existsByBarbero_IdAndServicio_Id(barberoId, servicioId)) {
            throw new RuntimeException("NOT_FOUND");
        }
        barberoServicioRepository.deleteByBarbero_IdAndServicio_Id(barberoId, servicioId);
        return true;
    }
}