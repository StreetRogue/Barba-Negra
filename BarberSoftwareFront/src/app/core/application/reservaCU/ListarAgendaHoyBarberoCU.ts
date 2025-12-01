import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservaRepository } from '../../domain/repositories/ReservaRepository';
import { ReservaDTORespuesta } from '../../domain/models/DTOs/Reserva/ReservaDTORespuesta';

@Injectable({
  providedIn: 'root'
})
export class ListarAgendaHoyBarberoUseCase {
  constructor(private reservaRepository: ReservaRepository) {}

  execute(idBarbero: number): Observable<ReservaDTORespuesta[]> {
    return this.reservaRepository.listarAgendaHoyBarbero(idBarbero);
  }
}