import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../../domain/models/Servicio'; 
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';

@Injectable({ providedIn: 'root' })
export class GetServicioByIdUseCase {
  constructor(private servicioRepo: ServicioRepository) {}

  execute(id: number): Observable<Servicio> {
    return this.servicioRepo.getServicioById(id);
  }
}
