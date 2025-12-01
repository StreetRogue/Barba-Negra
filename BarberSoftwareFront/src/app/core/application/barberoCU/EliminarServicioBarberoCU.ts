import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarberoRepository } from '../../domain/repositories/BarberRepository'; 

@Injectable({ providedIn: 'root' })
export class EliminarServicioBarberoUseCase {
  constructor(private repo: BarberoRepository) {}

  execute(barberoId: number, servicioId: number): Observable<void> {
    return this.repo.eliminarServicioDelBarbero(barberoId, servicioId);
  }
}