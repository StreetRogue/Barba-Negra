package co.edu.unicauca.microreservas.fachadaServices.services;

import co.edu.unicauca.microreservas.fachadaServices.DTO.SlotDTORespuesta;
import java.time.LocalDate;
import java.util.List;

public interface IAgendaService {

    // Calcula los huecos disponibles cruzando horario laboral vs reservas existentes
    List<SlotDTORespuesta> generarSlots(Integer idBarbero, Integer idServicio, LocalDate fecha);
}