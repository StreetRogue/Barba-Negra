import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarberoRepository } from '../../domain/repositories/BarberRepository'; 
import { HorarioLaboralDTOPeticion } from '../../domain/models/DTOs/Horarios/HorarioLaboralPeticionDTO';

@Injectable({ providedIn: 'root' })
export class GuardarHorariosUseCase {
    constructor(private repo: BarberoRepository) {}

    execute(horarios: HorarioLaboralDTOPeticion[]): Observable<any> {
        return this.repo.guardarHorarios(horarios);
    }
}