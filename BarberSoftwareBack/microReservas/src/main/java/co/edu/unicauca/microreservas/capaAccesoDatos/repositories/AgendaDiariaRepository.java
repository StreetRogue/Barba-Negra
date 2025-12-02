package co.edu.unicauca.microreservas.capaAccesoDatos.repositories;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.AgendaDiariaEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AgendaDiariaRepository extends JpaRepository<AgendaDiariaEntity, Long> { // Asumo Long según tu código anterior

    // Metodo vital para no crear agendas duplicadas para el mismo barbero en el mismo día
    Optional<AgendaDiariaEntity> findByIdBarberoAndFecha(Integer idBarbero, LocalDate fecha);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM AgendaDiariaEntity a WHERE a.idAgenda = :idAgenda")
    Optional<AgendaDiariaEntity> findByIdWithLock(@Param("idAgenda") Integer idAgenda);
}