import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';
import { ServicioDTORespuesta } from '../../domain/models/DTOs/Servicio/ServicioRespuestaDTO';

@Injectable({ providedIn: 'root' })
export class ListarServiciosUseCase {
  constructor(private repo: ServicioRepository) {}

  execute(): Observable<ServicioDTORespuesta[]> {
    return this.repo.listarServicios();
  }
}