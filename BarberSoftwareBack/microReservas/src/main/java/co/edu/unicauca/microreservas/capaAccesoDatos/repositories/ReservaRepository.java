package co.edu.unicauca.microreservas.capaAccesoDatos.repositories;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.ReservaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<ReservaEntity, Integer> { // Ojo: Integer porque así definiste tu @Id

    // 1. Para que el CLIENTE vea "Mis Reservas"
    List<ReservaEntity> findByIdUsuario(Integer idUsuario);

    // 2. Para obtener todas las reservas de un día específico (una Agenda)
    List<ReservaEntity> findByAgenda_IdAgenda(Integer idAgenda); // Asumiendo que AgendaDiariaEntity usa Long

    // 3. VALIDACIÓN DE CRUCES DE HORARIO
    // Busca reservas en la misma agenda que se solapen con el horario que intentas reservar.
    // Lógica: (InicioExistente < FinNuevo) Y (FinExistente > InicioNuevo)
    List<ReservaEntity> findByAgenda_IdAgendaAndHoraInicioLessThanAndHoraFinGreaterThan(
            Integer idAgenda, LocalDateTime horaFinNueva, LocalDateTime horaInicioNuevo);

    // 4. BÚSQUEDA PARA REPORTES (El método que te falta)
    // Esta consulta une la Reserva con la Agenda para filtrar por fecha, y aplica filtros opcionales
    @Query("SELECT r FROM ReservaEntity r " +
            "JOIN r.agenda a " +
            "WHERE a.fecha BETWEEN :fechaInicio AND :fechaFin " +
            "AND (:idBarbero IS NULL OR a.idBarbero = :idBarbero) " +
            "AND (:idServicio IS NULL OR r.idServicio = :idServicio)")
    List<ReservaEntity> buscarParaReporte(
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin,
            @Param("idBarbero") Integer idBarbero,
            @Param("idServicio") Integer idServicio
    );

    // Busca todas las reservas donde la agenda pertenece al barbero X
    List<ReservaEntity> findByAgenda_IdBarbero(Integer idBarbero);

    // 5. BUSCAR RESERVAS POR BARBERO Y RANGO DE HORAS (Para Dashboard Cliente - Hoy)
    // Spring Data traduce esto a:
    // SELECT * FROM reservas r
    // JOIN agendas a ON r.agenda_id = a.id
    // WHERE a.id_barbero = ? AND r.hora_inicio BETWEEN ? AND ?
    List<ReservaEntity> findByAgenda_IdBarberoAndHoraInicioBetween(
            Integer idBarbero,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin
    );
}