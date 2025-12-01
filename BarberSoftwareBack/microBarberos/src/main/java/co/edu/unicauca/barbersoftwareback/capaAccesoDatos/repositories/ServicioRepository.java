package co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.ServicioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServicioRepository extends JpaRepository<ServicioEntity, Integer> {

    // Buscar por categoría
    List<ServicioEntity> findByCategoria_Id(Integer idCategoria);

    // Buscar por estado (ej: "Activo")
    List<ServicioEntity> findByEstado(String estado);

    // Buscar por categoría y estado
    List<ServicioEntity> findByCategoria_IdAndEstado(Integer idCategoria, String estado);

    //Buscar por nombre
    Optional<ServicioEntity> findByNombre(String nombre);

    boolean existsByNombre(String nombre);

}
