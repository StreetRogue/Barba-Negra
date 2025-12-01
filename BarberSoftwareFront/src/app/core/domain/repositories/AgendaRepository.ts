import { Observable } from "rxjs";
import { SlotDTORespuesta } from "../models/DTOs/Agenda/SlotRespuestaDTO";

export abstract class AgendaRepository {
    abstract obtenerSlotsDisponibles(idBarbero: number, idServicio: number, fecha: string): Observable<SlotDTORespuesta[]>;
}