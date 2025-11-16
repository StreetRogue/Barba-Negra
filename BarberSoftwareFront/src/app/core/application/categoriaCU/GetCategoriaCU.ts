import { Injectable } from '@angular/core';
import { CategoriaRepository } from '../../domain/repositories/CategoriaRepository';  
import { ICategoria } from '../../domain/models/ICategoria'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCategoriasUseCase {
  constructor(private categoriaRepo: CategoriaRepository) {}

  execute(): Observable<ICategoria[]> {
    return this.categoriaRepo.getCategorias();
  }
}
