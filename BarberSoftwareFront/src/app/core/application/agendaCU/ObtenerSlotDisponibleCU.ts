import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgendaRepository } from '../../domain/repositories/AgendaRepository';
import { SlotDTORespuesta } from '../../domain/models/DTOs/Agenda/SlotRespuestaDTO';

@Injectable({ providedIn: 'root' })
export class ObtenerSlotsDisponiblesUseCase {
  constructor(private repo: AgendaRepository) {}

  execute(idBarbero: number, idServicio: number, fecha: string): Observable<SlotDTORespuesta[]> {
    return this.repo.obtenerSlotsDisponibles(idBarbero, idServicio, fecha);
  }
}