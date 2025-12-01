package co.edu.unicauca.microreservas.domain;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.ReservaEntity;

public class NoPresentado implements ReservaState {

    @Override
    public void enProceso(ReservaEntity reserva) {
        throw new IllegalStateException("El cliente fue marcado como No Presentado.");
    }

    @Override
    public void cancelar(ReservaEntity reserva) {
        throw new IllegalStateException("El cliente fue marcado como No Presentado.");
    }

    @Override
    public void completar(ReservaEntity reserva) {
        throw new IllegalStateException("El cliente fue marcado como No Presentado.");
    }

    @Override
    public void reprogramar(ReservaEntity reserva) {
        throw new IllegalStateException("El cliente fue marcado como No Presentado.");
    }

    @Override
    public void noPresentado(ReservaEntity reserva) {
        System.out.println("Ya está marcado como No Presentado.");
    }
}