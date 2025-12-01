package co.edu.unicauca.microreservas.domain;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.EstadoReservaEnum;
import co.edu.unicauca.microreservas.capaAccesoDatos.models.ReservaEntity;

public class Pendiente implements ReservaState {

    @Override
    public void enProceso(ReservaEntity reserva) {
        // Transición válida: El cliente llegó y se sienta en la silla
        reserva.setEstado(EstadoReservaEnum.EN_PROCESO);
    }

    @Override
    public void cancelar(ReservaEntity reserva) {
        // Transición válida: El cliente llama a cancelar antes de la cita
        reserva.setEstado(EstadoReservaEnum.CANCELADA);
    }

    @Override
    public void reprogramar(ReservaEntity reserva) {
        // Transición válida: Cambia de fecha
        reserva.setEstado(EstadoReservaEnum.REPROGRAMADA);
    }

    @Override
    public void noPresentado(ReservaEntity reserva) {
        // Transición válida: El cliente nunca llegó
        reserva.setEstado(EstadoReservaEnum.NO_PRESENTADO);
    }

    @Override
    public void completar(ReservaEntity reserva) {
        // Transición ILEGAL: No puedes completar una cita que ni ha empezado
        throw new IllegalStateException("No se puede completar una reserva que aún está Pendiente. Primero debe estar En Proceso.");
    }
}