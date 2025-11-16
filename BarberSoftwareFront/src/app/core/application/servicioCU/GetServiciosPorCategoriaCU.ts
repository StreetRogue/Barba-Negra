import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../../domain/models/Servicio'; 
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';

@Injectable({ providedIn: 'root' })
export class GetServiciosPorCategoriaUseCase {
  constructor(private servicioRepo: ServicioRepository) {}

  execute(idCategoria: number): Observable<Servicio[]> {
    return this.servicioRepo.getServiciosPorCategoria(idCategoria);
  }
}
