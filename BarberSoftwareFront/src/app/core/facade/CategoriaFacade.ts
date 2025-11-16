import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICategoria } from '../domain/models/ICategoria';
import { GetCategoriasUseCase } from '../application/categoriaCU/GetCategoriaCU'; 

@Injectable({
  providedIn: 'root'
})
export class CategoriaFacade {
  private categoriasSubject = new BehaviorSubject<ICategoria[]>([]);
  categorias$: Observable<ICategoria[]> = this.categoriasSubject.asObservable();

  constructor(private getCategoriasUseCase: GetCategoriasUseCase) {}

  /** Cargar categorías y actualizar el observable local */
  loadCategorias(): void {
    this.getCategoriasUseCase.execute().subscribe({
      next: (categorias) => this.categoriasSubject.next(categorias),
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  /** Permitir acceso directo al observable si no se desea cache local */
  getCategorias(): Observable<ICategoria[]> {
    return this.getCategoriasUseCase.execute();
  }
}
