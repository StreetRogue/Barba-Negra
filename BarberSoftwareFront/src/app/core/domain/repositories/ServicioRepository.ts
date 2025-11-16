import { Observable } from 'rxjs';
import { Servicio } from '../models/Servicio';
import { Injectable } from '@angular/core';


export abstract class ServicioRepository {
  abstract getServicios(): Observable<Servicio[]>;
  abstract getServiciosPorCategoria(idCategoria: number): Observable<Servicio[]>;
  abstract getServicioById(id: number): Observable<Servicio>;
  abstract getServiciosCliente(): Observable<Servicio[]>;
  abstract getServiciosClientePorCategoria(idCategoria: number): Observable<Servicio[]>;
  abstract create(servicio: Servicio): Observable<Servicio>;
  abstract update(servicio: Servicio): Observable<Servicio>;
  abstract deleteServicio(id: number): Observable<void>;
}
