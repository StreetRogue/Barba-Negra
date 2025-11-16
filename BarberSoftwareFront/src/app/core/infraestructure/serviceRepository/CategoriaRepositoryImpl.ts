import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaRepository } from '../../domain/repositories/CategoriaRepository'; 
import { ICategoria } from '../../domain/models/ICategoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaRepositoryImpl implements CategoriaRepository {
  private readonly urlEndPoint = 'http://localhost:5000/api/categorias';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<ICategoria[]> {
    console.log('Listando categorías desde la API');
    return this.http.get<ICategoria[]>(this.urlEndPoint);
  }
}
