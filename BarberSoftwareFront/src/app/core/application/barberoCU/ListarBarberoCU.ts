import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarberoRepository } from '../../domain/repositories/BarberRepository'; 
import { BarberoDTORespuesta } from '../../domain/models/DTOs/Barbero/BarberoRespuestaDTO';

@Injectable({
  providedIn: 'root' 
})
export class ListarBarberoUseCase {
  constructor(private barberoRepository: BarberoRepository) {}

  execute(): Observable<BarberoDTORespuesta[]> {
    return this.barberoRepository.listarBarberos();
  }

 
}