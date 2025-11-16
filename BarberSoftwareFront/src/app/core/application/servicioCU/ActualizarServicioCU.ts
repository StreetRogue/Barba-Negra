import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../../domain/models/Servicio'; 
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';

@Injectable({ providedIn: 'root' })
export class UpdateServicioUseCase {
  constructor(private servicioRepo: ServicioRepository) {}

  execute(servicio: Servicio): Observable<Servicio> {
    return this.servicioRepo.update(servicio);
  }
}
