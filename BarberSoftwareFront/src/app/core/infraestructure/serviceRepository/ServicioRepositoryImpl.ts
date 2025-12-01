import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';
import { ServicioDTOPeticion } from '../../domain/models/DTOs/Servicio/ServicioPeticionDTO';
import { ServicioDTORespuesta } from '../../domain/models/DTOs/Servicio/ServicioRespuestaDTO';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioRepositoryImpl extends ServicioRepository {

  private apiUrl = `${environment.apiGatewayUrl}/api/v1/microBarberos`; 

  constructor(private http: HttpClient) {
    super();
  }

  // --- MÉTODOS BÁSICOS ---

  listarServicios(): Observable<ServicioDTORespuesta[]> {
    return this.http.get<ServicioDTORespuesta[]>(`${this.apiUrl}/servicios`);
  }

  crearServicio(servicio: ServicioDTOPeticion): Observable<ServicioDTORespuesta> {
    return this.http.post<ServicioDTORespuesta>(`${this.apiUrl}/servicios`, servicio);
  }

  actualizarServicio(id: number, servicio: ServicioDTOPeticion): Observable<ServicioDTORespuesta> {
    const url = `${this.apiUrl}/servicios/${id}`;
    return this.http.put<ServicioDTORespuesta>(url, servicio);
  }

  eliminarServicio(id: number): Observable<void> {
    const url = `${this.apiUrl}/servicios/${id}`;
    return this.http.delete<void>(url);
  }

  consultarServicio(id: number): Observable<ServicioDTORespuesta> {
    const url = `${this.apiUrl}/servicios/${id}`;
    return this.http.get<ServicioDTORespuesta>(url);
  }

  listarServiciosPorCategoria(idCategoria: number): Observable<ServicioDTORespuesta[]> {
    const url = `${this.apiUrl}/servicios/categoria/${idCategoria}`;
    return this.http.get<ServicioDTORespuesta[]>(url);
  }

  listarServiciosActivosPorCategoria(idCategoria: number): Observable<ServicioDTORespuesta[]> {
    const url = `${this.apiUrl}/servicios/cliente/categoria/${idCategoria}`;
    return this.http.get<ServicioDTORespuesta[]>(url);
  }
}