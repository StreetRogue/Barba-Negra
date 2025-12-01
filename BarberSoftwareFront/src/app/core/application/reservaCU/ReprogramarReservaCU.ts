import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservaRepository } from '../../domain/repositories/ReservaRepository';
import { ReservaDTOPeticion } from '../../domain/models/DTOs/Reserva/ReservaDTOPeticion';
import { ReservaDTORespuesta } from '../../domain/models/DTOs/Reserva/ReservaDTORespuesta';

@Injectable({ providedIn: 'root' })
export class ReprogramarReservaUseCase {
  constructor(private repo: ReservaRepository) {}

  execute(idReserva: number, nuevosDatos: ReservaDTOPeticion): Observable<ReservaDTORespuesta> {
    return this.repo.reprogramarReserva(idReserva, nuevosDatos);
  }
}