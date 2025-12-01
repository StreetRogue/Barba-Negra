package co.edu.unicauca.microreservas.domain;

import co.edu.unicauca.microreservas.capaAccesoDatos.models.ReservaEntity;

public interface ReservaState {
    // Métodos que representan las transiciones permitidas
    void enProceso(ReservaEntity reserva);
    void cancelar(ReservaEntity reserva);
    void completar(ReservaEntity reserva);
    void reprogramar(ReservaEntity reserva);
    void noPresentado(ReservaEntity reserva);

}
