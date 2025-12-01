import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObtenerSlotsDisponiblesUseCase } from '../application/agendaCU/ObtenerSlotDisponibleCU';
import { SlotDTORespuesta } from '../domain/models/DTOs/Agenda/SlotRespuestaDTO';

@Injectable({ providedIn: 'root' })
export class AgendaFacade {
  constructor(private obtenerSlotsUC: ObtenerSlotsDisponiblesUseCase) {}

  public obtenerSlots(idBarbero: number, idServicio: number, fecha: string): Observable<SlotDTORespuesta[]> {
    return this.obtenerSlotsUC.execute(idBarbero, idServicio, fecha);
  }
}