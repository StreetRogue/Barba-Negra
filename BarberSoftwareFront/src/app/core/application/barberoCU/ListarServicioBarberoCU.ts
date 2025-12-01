import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarberoRepository } from '../../domain/repositories/BarberRepository'; 
import { BarberoServicioRespuestaDTO } from '../../domain/models/DTOs/BarberoServicio/BarberoServicioRespuestaDTO'; 

@Injectable({ providedIn: 'root' })
export class ListarServiciosBarberoUseCase {
  constructor(private repo: BarberoRepository) {}

  execute(barberoId: number): Observable<BarberoServicioRespuestaDTO[]> {
    return this.repo.listarServiciosPorBarbero(barberoId);
  }
}