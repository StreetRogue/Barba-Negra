import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';
import { ServicioDTORespuesta } from '../../domain/models/DTOs/Servicio/ServicioRespuestaDTO';

@Injectable({ providedIn: 'root' })
export class ConsultarServicioUseCase {
  constructor(private repo: ServicioRepository) {}

  execute(id: number): Observable<ServicioDTORespuesta> {
    return this.repo.consultarServicio(id);
  }
}