import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaRepository } from '../../domain/repositories/CategoriaRepository';
import { CategoriaDTORespuesta } from '../../domain/models/DTOs/Categorias/CategoriaRespuestaDTO';
import { environment } from '../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class CategoriaRepositoryImpl extends CategoriaRepository {

  // Ajusta la URL según tu backend real
  private apiUrl = `${environment.apiGatewayUrl}/api/v1/microBarberos/categorias`; 

  constructor(private http: HttpClient) {
    super();
  }

  listarCategorias(): Observable<CategoriaDTORespuesta[]> {
    return this.http.get<CategoriaDTORespuesta[]>(this.apiUrl);
  }
}