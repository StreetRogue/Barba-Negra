import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';
import { Servicio } from '../../domain/models/Servicio'; 

@Injectable({
  providedIn: 'root'
})
export class ServicioRepositoryImpl implements ServicioRepository {
  private readonly urlEndPoint = 'http://localhost:5000/api/servicios';
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.urlEndPoint);
  }

  getServiciosPorCategoria(idCategoria: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.urlEndPoint}/categoria/${idCategoria}`);
  }

  getServicioById(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.urlEndPoint}/${id}`);
  }

  getServiciosCliente(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.urlEndPoint}/cliente`);
  }

  getServiciosClientePorCategoria(idCategoria: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.urlEndPoint}/cliente/categoria/${idCategoria}`);
  }

  create(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.urlEndPoint, servicio, { headers: this.httpHeaders });
  }

  update(servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.urlEndPoint}/${servicio.id}`, servicio, { headers: this.httpHeaders });
  }

  deleteServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders });
  }
}
