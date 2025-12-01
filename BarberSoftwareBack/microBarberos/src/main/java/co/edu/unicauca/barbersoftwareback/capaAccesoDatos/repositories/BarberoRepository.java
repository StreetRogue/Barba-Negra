package co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.BarberoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarberoRepository extends JpaRepository<BarberoEntity, Integer> {

    // Buscar por nombre exacto
    Optional<BarberoEntity> findByNombre(String nombre);

    List<BarberoEntity> findByEstado(String estado);

    boolean existsByEmail(String email);
}
