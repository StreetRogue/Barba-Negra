package co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.BarberoServicioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface BarberoServicioRepository extends JpaRepository<BarberoServicioEntity, Integer> {

    // Obtener todos los servicios que puede hacer un barbero
    List<BarberoServicioEntity> findByBarbero_Id(Integer barberoId);

    // Obtener todos los barberos que pueden hacer un servicio
    List<BarberoServicioEntity> findByServicio_Id(Integer servicioId);

    // Buscar una asignación específica barbero-servicio
    Optional<BarberoServicioEntity> findByBarbero_IdAndServicio_Id(Integer barberoId, Integer servicioId);

    boolean existsByBarbero_IdAndServicio_Id(Integer barberoId, Integer servicioId);

    void deleteByBarbero_IdAndServicio_Id(Integer barberoId, Integer servicioId);
}
