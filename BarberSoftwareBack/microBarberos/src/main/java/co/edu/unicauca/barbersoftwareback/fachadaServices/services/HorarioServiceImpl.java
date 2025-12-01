package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.BarberoEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.HorarioLaboralEntity;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.BarberoRepository;
import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories.HorarioLaboralRepository;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.HorarioLaboralDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.HorarioLaboralDTORespuesta;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
public class HorarioServiceImpl implements IHorarioService {

    private final HorarioLaboralRepository horarioRepository;
    private final BarberoRepository barberoRepository;
    private final ModelMapper mapper;

    public HorarioServiceImpl(HorarioLaboralRepository horarioRepository,
                              BarberoRepository barberoRepository,
                              ModelMapper mapper) {
        this.horarioRepository = horarioRepository;
        this.barberoRepository = barberoRepository;
        this.mapper = mapper;
    }


    @Override
    @Transactional(readOnly = true)
    public List<HorarioLaboralDTORespuesta> findByBarberoId(Integer barberoId) {
        if (!barberoRepository.existsById(barberoId)) {
            throw new RuntimeException("NOT_FOUND"); // Barbero no existe
        }
        List<HorarioLaboralEntity> lista = horarioRepository.findByBarbero_Id(barberoId);

        return lista.stream().map(this::mapearRespuesta).toList();
    }

    @Override
    @Transactional
    public List<HorarioLaboralDTORespuesta> crearHorario(List<HorarioLaboralDTOPeticion> listaDtos) {
        System.out.println(">>> INICIO CREAR HORARIO - Recibidos: " + (listaDtos != null ? listaDtos.size() : "NULL"));

        if (listaDtos == null || listaDtos.isEmpty()) {
            System.out.println(">>> ERROR: Lista vacía o nula");
            throw new RuntimeException("BAD_REQUEST");
        }

        Integer idBarbero = listaDtos.get(0).getIdBarbero();
        System.out.println(">>> ID Barbero: " + idBarbero);

        if (idBarbero == null) {
            System.out.println(">>> ERROR: ID Barbero es NULL");
            throw new RuntimeException("BAD_REQUEST");
        }

        BarberoEntity barbero = barberoRepository.findById(idBarbero)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Borrado de antiguos
        horarioRepository.deleteByBarbero_Id(idBarbero);
        horarioRepository.flush();
        System.out.println(">>> Horarios antiguos eliminados");

        List<HorarioLaboralEntity> entidadesAGuardar = new ArrayList<>();

        for (HorarioLaboralDTOPeticion dto : listaDtos) {
            System.out.println(">>> Procesando Día: " + dto.getDiaSemana() +
                    " | Inicio: " + dto.getHoraInicio() +
                    " | Fin: " + dto.getHoraFin() +
                    " | Libre: " + dto.getEsDiaLibre());

            // AQUI ES DONDE SEGURAMENTE FALLA
            try {
                validarHoras(dto);
            } catch (Exception e) {
                System.out.println(">>> ❌ ERROR EN VALIDAR_HORAS: " + e.getMessage());
                System.out.println(">>> Datos que fallaron -> Inicio: " + dto.getHoraInicio() + " Fin: " + dto.getHoraFin());
                throw e; // Relanzamos para que el GlobalExceptionHandler lo capture
            }

            HorarioLaboralEntity entity = new HorarioLaboralEntity();
            entity.setDiaSemana(dto.getDiaSemana());
            entity.setEsDiaLibre(dto.getEsDiaLibre());
            entity.setHoraInicio(dto.getHoraInicio());
            entity.setHoraFin(dto.getHoraFin());
            entity.setBarbero(barbero);

            entidadesAGuardar.add(entity);
        }

        List<HorarioLaboralEntity> guardados = horarioRepository.saveAll(entidadesAGuardar);
        System.out.println(">>> Guardado exitoso de " + guardados.size() + " registros.");

        return guardados.stream().map(this::mapearRespuesta).toList();
    }

    @Override
    @Transactional
    public HorarioLaboralDTORespuesta update(Integer id, HorarioLaboralDTOPeticion dto) {
        if (dto == null) throw new RuntimeException("BAD_REQUEST");

        HorarioLaboralEntity entity = horarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Validar lógica de horas si vienen datos
        if (Boolean.FALSE.equals(dto.getEsDiaLibre()) ||
                (dto.getEsDiaLibre() == null && !entity.getEsDiaLibre())) {
            // Si es día laboral, validamos horas
            if (dto.getHoraInicio() != null && dto.getHoraFin() != null) {
                if (dto.getHoraInicio().isAfter(dto.getHoraFin())) {
                    throw new RuntimeException("BAD_REQUEST");
                }
            }
        }

        if (dto.getDiaSemana() != null) entity.setDiaSemana(dto.getDiaSemana());
        if (dto.getEsDiaLibre() != null) entity.setEsDiaLibre(dto.getEsDiaLibre());
        if (dto.getHoraInicio() != null) entity.setHoraInicio(dto.getHoraInicio());
        if (dto.getHoraFin() != null) entity.setHoraFin(dto.getHoraFin());

        return mapearRespuesta(horarioRepository.save(entity));
    }

    // --- Métodos Auxiliares ---

    private void validarHoras(HorarioLaboralDTOPeticion dto) {
        if (Boolean.FALSE.equals(dto.getEsDiaLibre())) {
            if (dto.getHoraInicio() == null || dto.getHoraFin() == null) {
                throw new RuntimeException("BAD_REQUEST");
            }
            if (dto.getHoraInicio().isAfter(dto.getHoraFin())) {
                throw new RuntimeException("BAD_REQUEST");
            }
        }
    }

    private HorarioLaboralDTORespuesta mapearRespuesta(HorarioLaboralEntity entity) {
        HorarioLaboralDTORespuesta dto = mapper.map(entity, HorarioLaboralDTORespuesta.class);
        if (entity.getBarbero() != null) {
            dto.setIdBarbero(entity.getBarbero().getId());
            dto.setNombreBarbero(entity.getBarbero().getNombre());
        }
        return dto;
    }
}