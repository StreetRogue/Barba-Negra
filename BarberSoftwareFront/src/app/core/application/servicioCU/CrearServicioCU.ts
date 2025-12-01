import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';
import { ServicioDTOPeticion } from '../../domain/models/DTOs/Servicio/ServicioPeticionDTO';
import { ServicioDTORespuesta } from '../../domain/models/DTOs/Servicio/ServicioRespuestaDTO';

@Injectable({ providedIn: 'root' })
export class CrearServicioUseCase {
  constructor(private repo: ServicioRepository) {}

  execute(servicio: ServicioDTOPeticion): Observable<ServicioDTORespuesta> {
    return this.repo.crearServicio(servicio);
  }
}