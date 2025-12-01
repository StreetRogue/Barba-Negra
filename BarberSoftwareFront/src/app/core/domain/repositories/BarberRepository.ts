import { Observable } from 'rxjs';
import { RegisterBarberoDTO } from '../models/DTOs/Barbero/RegisterBarberoDTO';
import { BarberoDTORespuesta } from '../models/DTOs/Barbero/BarberoRespuestaDTO';
import { HorarioLaboralDTOPeticion } from '../models/DTOs/Horarios/HorarioLaboralPeticionDTO';
import { HorarioLaboralDTORespuesta } from '../models/DTOs/Horarios/HorarioLaboralRespuestaDTO';
import { BarberoServicioPeticionDTO } from '../models/DTOs/BarberoServicio/BarberoServicioPeticionDTO';
import { BarberoServicioRespuestaDTO } from '../models/DTOs/BarberoServicio/BarberoServicioRespuestaDTO';

export abstract class BarberoRepository {
    abstract registrarBarbero(barbero: RegisterBarberoDTO): Observable<any>;
    abstract listarBarberos(): Observable<BarberoDTORespuesta[]>;
    abstract actualizarBarbero(id: number, barbero: BarberoDTORespuesta): Observable<any>;
    abstract guardarHorarios(horarios: HorarioLaboralDTOPeticion[]): Observable<any>;
    abstract obtenerHorariosPorBarbero(idBarbero: number): Observable<HorarioLaboralDTORespuesta[]>;
    abstract asignarServicio(peticion: BarberoServicioPeticionDTO): Observable<BarberoServicioRespuestaDTO>;
    abstract listarServiciosPorBarbero(barberoId: number): Observable<BarberoServicioRespuestaDTO[]>;
    abstract eliminarServicioDelBarbero(barberoId: number, servicioId: number): Observable<void>;
    abstract listarBarberosPorServicio(servicioId: number): Observable<BarberoServicioRespuestaDTO[]>;
}