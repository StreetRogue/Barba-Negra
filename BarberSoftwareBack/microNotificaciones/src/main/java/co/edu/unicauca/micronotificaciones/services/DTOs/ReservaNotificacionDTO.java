package co.edu.unicauca.micronotificaciones.services.DTOs;

import java.time.LocalDateTime;

public class ReservaNotificacionDTO {

    private Long idReserva;
    private Long clienteId;
    private Long barberoId;
    private LocalDateTime horaInicio;
    private LocalDateTime horaFin;
    private String serviceName;
    private String estado;

    public ReservaNotificacionDTO() {
    }

    public ReservaNotificacionDTO(Long idReserva,
                                  Long clienteId,
                                  Long barberoId,
                                  LocalDateTime horaInicio,
                                  LocalDateTime horaFin,
                                  String serviceName,
                                  String estado) {
        this.idReserva = idReserva;
        this.clienteId = clienteId;
        this.barberoId = barberoId;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.serviceName = serviceName;
        this.estado = estado;
    }

    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getBarberoId() {
        return barberoId;
    }

    public void setBarberoId(Long barberoId) {
        this.barberoId = barberoId;
    }

    public LocalDateTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalDateTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalDateTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalDateTime horaFin) {
        this.horaFin = horaFin;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }


}
