package co.edu.unicauca.microreservas.domain;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.EstadoReservaEnum;
import co.edu.unicauca.microreservas.capaAccesoDatos.models.ReservaEntity;

public class EnProceso implements ReservaState {

    @Override
    public void enProceso(ReservaEntity reserva) {
        System.out.println("La reserva ya se encuentra en proceso.");
    }

    @Override
    public void cancelar(ReservaEntity reserva) {
        throw new IllegalStateException("No se puede cancelar una reserva que ya está en proceso de atención.");
    }

    @Override
    public void completar(ReservaEntity reserva) {
        reserva.setEstado(EstadoReservaEnum.COMPLETADA);
    }

    @Override
    public void reprogramar(ReservaEntity reserva) {
        throw new IllegalStateException("No se puede reprogramar una reserva que ya está en proceso.");
    }

    @Override
    public void noPresentado(ReservaEntity reserva) {
        throw new IllegalStateException("El cliente ya está siendo atendido, no se puede marcar como No Presentado.");
    }
}