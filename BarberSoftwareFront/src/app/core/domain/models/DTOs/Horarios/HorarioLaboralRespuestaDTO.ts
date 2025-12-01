export interface HorarioLaboralDTORespuesta {
    id: number;
    idBarbero: number;
    nombreBarbero: string;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    esDiaLibre: boolean;
}