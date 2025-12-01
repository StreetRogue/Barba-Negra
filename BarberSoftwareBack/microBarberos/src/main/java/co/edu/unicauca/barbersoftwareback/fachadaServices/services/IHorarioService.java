package co.edu.unicauca.barbersoftwareback.fachadaServices.services;

import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.HorarioLaboralDTOPeticion;
import co.edu.unicauca.barbersoftwareback.fachadaServices.DTO.HorarioLaboralDTORespuesta;
import java.util.List;

public interface IHorarioService {

    // Obtener todos los horarios de un barbero
    List<HorarioLaboralDTORespuesta> findByBarberoId(Integer barberoId);

    // Configura toda la semana de una vez
    List<HorarioLaboralDTORespuesta> crearHorario(List<HorarioLaboralDTOPeticion> horariosSemana);

    // Actualizar un día específico
    HorarioLaboralDTORespuesta update(Integer id, HorarioLaboralDTOPeticion dto);
}