package co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.HorarioLaboralEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HorarioLaboralRepository extends JpaRepository<HorarioLaboralEntity, Integer> {

    //Lista de los 7 horarios del barbero
    List<HorarioLaboralEntity> findByBarbero_Id(Integer barberoId);

    // Buscar si el barbero trabaja un día específico
    Optional<HorarioLaboralEntity> findByBarbero_IdAndDiaSemana(Integer barberoId, Integer diaSemana);

    // Para borrar horarios viejos antes de actualizar
    void deleteByBarbero_Id(Integer barberoId);
}