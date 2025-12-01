export interface HorarioLaboralDTOPeticion {
    idBarbero: number;
    diaSemana: number; 
    horaInicio?: string; 
    horaFin?: string;   
    esDiaLibre: boolean;
}