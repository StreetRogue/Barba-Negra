import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';

@Injectable({ providedIn: 'root' })
export class EliminarServicioUseCase {
  constructor(private repo: ServicioRepository) {}

  execute(id: number): Observable<void> {
    return this.repo.eliminarServicio(id);
  }
}