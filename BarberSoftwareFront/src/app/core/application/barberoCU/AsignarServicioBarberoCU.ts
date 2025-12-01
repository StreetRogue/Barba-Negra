import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarberoRepository } from '../../domain/repositories/BarberRepository'; 
import { BarberoServicioPeticionDTO } from '../../domain/models/DTOs/BarberoServicio/BarberoServicioPeticionDTO'; 
import { BarberoServicioRespuestaDTO } from '../../domain/models/DTOs/BarberoServicio/BarberoServicioRespuestaDTO';

@Injectable({ providedIn: 'root' })
export class AsignarServicioBarberoUseCase {
  constructor(private repo: BarberoRepository) {}

  execute(peticion: BarberoServicioPeticionDTO): Observable<BarberoServicioRespuestaDTO> {
    return this.repo.asignarServicio(peticion);
  }
}