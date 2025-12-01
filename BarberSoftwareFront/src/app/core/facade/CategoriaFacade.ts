import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListarCategoriasUseCase } from '../application/categoriaCU/ListarCategoriasCU';
import { CategoriaDTORespuesta } from '../domain/models/DTOs/Categorias/CategoriaRespuestaDTO';

@Injectable({
  providedIn: 'root'
})
export class CategoriaFacade {
  constructor(private listarUC: ListarCategoriasUseCase) {}

  public listarCategoria(): Observable<CategoriaDTORespuesta[]> {
    return this.listarUC.execute();
  }
}