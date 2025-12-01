package co.edu.unicauca.microreservas.domain;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.ReservaEntity;

public class Completada implements ReservaState {

    @Override
    public void enProceso(ReservaEntity reserva) {
        throw new IllegalStateException("El servicio ya fue completado.");
    }

    @Override
    public void cancelar(ReservaEntity reserva) {
        throw new IllegalStateException("El servicio ya fue completado.");
    }

    @Override
    public void completar(ReservaEntity reserva) {
        System.out.println("La reserva ya está completada.");
    }

    @Override
    public void reprogramar(ReservaEntity reserva) {
        throw new IllegalStateException("El servicio ya fue completado.");
    }

    @Override
    public void noPresentado(ReservaEntity reserva) {
        throw new IllegalStateException("El servicio ya fue completado.");
    }
}