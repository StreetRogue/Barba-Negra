export interface ReservaDTORespuesta {
    idReserva: number;
    idUsuario: number;
    idBarbero: number;
    idServicio: number;
    horaInicio: string; // LocalDateTime
    horaFin: string;    // LocalDateTime
    estado: string;     // 'PENDIENTE', 'CONFIRMADA', etc.
}