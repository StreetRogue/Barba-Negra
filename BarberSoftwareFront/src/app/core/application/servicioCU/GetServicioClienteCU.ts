import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../../domain/models/Servicio'; 
import { ServicioRepository } from '../../domain/repositories/ServicioRepository';

@Injectable({ providedIn: 'root' })
export class GetServiciosClienteUseCase {
  constructor(private servicioRepo: ServicioRepository) {}

  execute(): Observable<Servicio[]> {
    return this.servicioRepo.getServiciosCliente();
  }
}
