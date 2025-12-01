import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';
import { ServicioDTORespuesta } from '../../domain/models/DTOs/Servicio/ServicioRespuestaDTO';

@Injectable({ providedIn: 'root' })
export class ListarServiciosActivosPorCategoriaUseCase {
  constructor(private repo: ServicioRepository) {}

  execute(idCategoria: number): Observable<ServicioDTORespuesta[]> {
    return this.repo.listarServiciosActivosPorCategoria(idCategoria);
  }
}