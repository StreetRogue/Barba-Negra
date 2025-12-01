package co.edu.unicauca.barbersoftwareback.capaAccesoDatos.repositories;

import co.edu.unicauca.barbersoftwareback.capaAccesoDatos.models.CategoriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaEntity, Integer> {

    // findAll() YA viene incluido por defecto en JpaRepository
}
