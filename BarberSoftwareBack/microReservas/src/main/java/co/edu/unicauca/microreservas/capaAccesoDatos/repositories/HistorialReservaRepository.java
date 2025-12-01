package co.edu.unicauca.microreservas.capaAccesoDatos.repositories;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.HistorialReservaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialReservaRepository extends JpaRepository<HistorialReservaEntity, Integer> { // Integer según tu último código

    // Recuperar todo el historial de una reserva específica ordenado del más reciente al más antiguo
    List<HistorialReservaEntity> findByReserva_IdReservaOrderByFechaCambioDesc(Integer idReserva);
}