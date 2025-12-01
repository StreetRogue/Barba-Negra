import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservaRepository } from '../../domain/repositories/ReservaRepository';
import { ReservaDTORespuesta } from '../../domain/models/DTOs/Reserva/ReservaDTORespuesta';

@Injectable({ providedIn: 'root' })
export class ListarReservasUseCase {
  constructor(private repo: ReservaRepository) {}

  execute(): Observable<ReservaDTORespuesta[]> {
    return this.repo.listarTodas();
  }
}