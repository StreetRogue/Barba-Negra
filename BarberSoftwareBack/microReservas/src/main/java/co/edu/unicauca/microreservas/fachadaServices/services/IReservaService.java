package co.edu.unicauca.microreservas.fachadaServices.services;

import co.edu.unicauca.microreservas.fachadaServices.DTO.ReservaDTOPeticion;
import co.edu.unicauca.microreservas.fachadaServices.DTO.ReservaDTORespuesta;

import java.util.List;

public interface IReservaService {

    ReservaDTORespuesta crearReserva(Integer idUsuario,String emailCliente, ReservaDTOPeticion peticion);

    ReservaDTORespuesta iniciarServicio(Integer idReserva, String emailUsuario);

    ReservaDTORespuesta cancelarReserva(Integer idReserva, String emailUsuario);

    ReservaDTORespuesta reprogramarReserva(Integer idReserva, String emailUsuario, ReservaDTOPeticion nuevosDatos);

    ReservaDTORespuesta marcarCompletada(Integer idReserva,String emailUsuario);

    ReservaDTORespuesta marcarNoPresentado(Integer idReserva,String emailUsuario);

    List<ReservaDTORespuesta> listarTodas();

    List<ReservaDTORespuesta> listarPorCliente(String emailCliente);

    ReservaDTORespuesta consultarPorId(Integer idReserva);

    List<ReservaDTORespuesta> listarAgendaBarbero(String emailBarbero);

    List<ReservaDTORespuesta> listarAgendaHoyBarbero(Integer idBarbero);
}