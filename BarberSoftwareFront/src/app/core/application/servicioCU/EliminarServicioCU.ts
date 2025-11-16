import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioRepository } from '../../domain/repositories/ServicioRepository'; 

@Injectable({ providedIn: 'root' })
export class DeleteServicioUseCase {
  constructor(private servicioRepo: ServicioRepository) {}

  execute(id: number): Observable<void> {
    return this.servicioRepo.deleteServicio(id);
  }
}
