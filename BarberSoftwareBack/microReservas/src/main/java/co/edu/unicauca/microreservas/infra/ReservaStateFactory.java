package co.edu.unicauca.microreservas.infra;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.EstadoReservaEnum;
import co.edu.unicauca.microreservas.domain.*;

public class ReservaStateFactory {

    public static ReservaState getState(EstadoReservaEnum estadoEnum) {
        return switch (estadoEnum) {
            case PENDIENTE -> new Pendiente();
            case EN_PROCESO -> new EnProceso();
            case CANCELADA -> new Cancelada();
            case COMPLETADA -> new Completada();
            case NO_PRESENTADO -> new NoPresentado();
            case REPROGRAMADA -> new Reprogramada();
            default -> throw new IllegalArgumentException("Estado desconocido: " + estadoEnum);
        };
    }
}
