import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarberoRepository } from '../../domain/repositories/BarberRepository'; 
import { HorarioLaboralDTORespuesta } from '../../domain/models/DTOs/Horarios/HorarioLaboralRespuestaDTO'; 

@Injectable({ providedIn: 'root' })
export class ObtenerHorariosUseCase {
    constructor(private repo: BarberoRepository) {}

    execute(idBarbero: number): Observable<HorarioLaboralDTORespuesta[]> {
        return this.repo.obtenerHorariosPorBarbero(idBarbero);
    }
}