package co.edu.unicauca.microreservas.domain;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.EstadoReservaEnum;
import co.edu.unicauca.microreservas.capaAccesoDatos.models.ReservaEntity;

public class Reprogramada implements ReservaState {

    @Override
    public void enProceso(ReservaEntity reserva) {
        reserva.setEstado(EstadoReservaEnum.EN_PROCESO);
    }

    @Override
    public void cancelar(ReservaEntity reserva) {
        reserva.setEstado(EstadoReservaEnum.CANCELADA);
    }

    @Override
    public void completar(ReservaEntity reserva) {
        throw new IllegalStateException("Debe iniciar el servicio (En Proceso) antes de completarlo.");
    }

    @Override
    public void reprogramar(ReservaEntity reserva) {
        reserva.setEstado(EstadoReservaEnum.REPROGRAMADA);
    }

    @Override
    public void noPresentado(ReservaEntity reserva) {
        reserva.setEstado(EstadoReservaEnum.NO_PRESENTADO);
    }
}