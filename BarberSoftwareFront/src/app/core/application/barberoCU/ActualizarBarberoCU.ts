import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarberoRepository } from '../../domain/repositories/BarberRepository';
import { BarberoDTORespuesta } from '../../domain/models/DTOs/Barbero/BarberoRespuestaDTO';

@Injectable({
    providedIn: 'root'
})
export class ActualizarBarberoUseCase {
    constructor(private barberoRepository: BarberoRepository) { }

    execute(id: number, barbero: BarberoDTORespuesta): Observable<any> {
        return this.barberoRepository.actualizarBarbero(id, barbero);
    }


}