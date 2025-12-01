package co.edu.unicauca.microreservas.domain;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.ReservaEntity;

public class Cancelada implements ReservaState {

    @Override
    public void enProceso(ReservaEntity reserva) {
        throw new IllegalStateException("La reserva está cancelada.");
    }

    @Override
    public void cancelar(ReservaEntity reserva) {
        System.out.println("La reserva ya estaba cancelada.");
    }

    @Override
    public void completar(ReservaEntity reserva) {
        throw new IllegalStateException("La reserva está cancelada.");
    }

    @Override
    public void reprogramar(ReservaEntity reserva) {
        throw new IllegalStateException("No se puede reprogramar una reserva cancelada.");
    }

    @Override
    public void noPresentado(ReservaEntity reserva) {
        throw new IllegalStateException("La reserva está cancelada.");
    }
}