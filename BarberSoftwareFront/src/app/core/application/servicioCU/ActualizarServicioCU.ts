import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';
import { ServicioDTOPeticion } from '../../domain/models/DTOs/Servicio/ServicioPeticionDTO';
import { ServicioDTORespuesta } from '../../domain/models/DTOs/Servicio/ServicioRespuestaDTO';

@Injectable({ providedIn: 'root' })
export class ActualizarServicioUseCase {
  constructor(private repo: ServicioRepository) {}

  execute(id: number, servicio: ServicioDTOPeticion): Observable<ServicioDTORespuesta> {
    return this.repo.actualizarServicio(id, servicio);
  }
}