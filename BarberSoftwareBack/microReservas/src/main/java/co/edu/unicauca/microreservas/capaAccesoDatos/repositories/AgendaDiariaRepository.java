package co.edu.unicauca.microreservas.capaAccesoDatos.repositories;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.AgendaDiariaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AgendaDiariaRepository extends JpaRepository<AgendaDiariaEntity, Long> { // Asumo Long según tu código anterior

    // Metodo vital para no crear agendas duplicadas para el mismo barbero en el mismo día
    Optional<AgendaDiariaEntity> findByIdBarberoAndFecha(Integer idBarbero, LocalDate fecha);
}