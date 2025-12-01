package co.edu.unicauca.microreservas.fachadaServices.services;

import co.edu.unicauca.microreservas.fachadaServices.DTO.HistorialReservaDTORespuesta;
import co.edu.unicauca.microreservas.fachadaServices.DTO.ReporteDTOPeticion;
import co.edu.unicauca.microreservas.fachadaServices.DTO.ReporteDTORespuesta;

import java.util.List;

public interface IReporteService {

    ReporteDTORespuesta generarReporte(ReporteDTOPeticion peticion);

    List<HistorialReservaDTORespuesta> consultarHistorial(Integer idReserva);
}