import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarberoRepository } from '../../domain/repositories/BarberRepository'; 
import { RegisterBarberoDTO } from '../../domain/models/DTOs/Barbero/RegisterBarberoDTO';

@Injectable({
  providedIn: 'root' // O quítalo si lo provees manualmente en app.config
})
export class RegistrarBarberoUseCase {
  constructor(private barberoRepository: BarberoRepository) {}

  execute(barbero: RegisterBarberoDTO): Observable<any> {
    return this.barberoRepository.registrarBarbero(barbero);
  }

 
}