import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaRepository } from '../../domain/repositories/CategoriaRepository';
import { CategoriaDTORespuesta } from '../../domain/models/DTOs/Categorias/CategoriaRespuestaDTO';

@Injectable({ providedIn: 'root' })
export class ListarCategoriasUseCase {
  constructor(private repo: CategoriaRepository) {}

  execute(): Observable<CategoriaDTORespuesta[]> {
    return this.repo.listarCategorias();
  }
}