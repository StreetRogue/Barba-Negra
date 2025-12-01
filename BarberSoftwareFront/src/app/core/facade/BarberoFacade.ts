import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrarBarberoUseCase } from '../application/barberoCU/RegistrarBarberoCU';
import { RegisterBarberoDTO } from '../domain/models/DTOs/Barbero/RegisterBarberoDTO';
import { BarberoDTORespuesta } from '../domain/models/DTOs/Barbero/BarberoRespuestaDTO';
import { ListarBarberoUseCase } from '../application/barberoCU/ListarBarberoCU';
import { ActualizarBarberoUseCase } from '../application/barberoCU/ActualizarBarberoCU';
import { GuardarHorariosUseCase } from '../application/barberoCU/GuardarHorarioCU';
import { ObtenerHorariosUseCase } from '../application/barberoCU/ObtenerHorarioCU';
import { HorarioLaboralDTOPeticion } from '../domain/models/DTOs/Horarios/HorarioLaboralPeticionDTO';
import { HorarioLaboralDTORespuesta } from '../domain/models/DTOs/Horarios/HorarioLaboralRespuestaDTO';
import { AsignarServicioBarberoUseCase } from '../application/barberoCU/AsignarServicioBarberoCU';
import { ListarServiciosBarberoUseCase } from '../application/barberoCU/ListarServicioBarberoCU';
import { EliminarServicioBarberoUseCase } from '../application/barberoCU/EliminarServicioBarberoCU';
import { BarberoServicioPeticionDTO } from '../domain/models/DTOs/BarberoServicio/BarberoServicioPeticionDTO';
import { BarberoServicioRespuestaDTO } from '../domain/models/DTOs/BarberoServicio/BarberoServicioRespuestaDTO';
import { ListarBarberosPorServicioUseCase } from '../application/barberoCU/ListarBarberoPorServicioCU';


@Injectable({
  providedIn: 'root'
})
export class BarberoFacade {
  constructor(private registrarBarberoUseCase: RegistrarBarberoUseCase,
    private listarBarberosUseCase: ListarBarberoUseCase,
    private actualizarBarberoUseCase: ActualizarBarberoUseCase,
    private guardarHorariosCU: GuardarHorariosUseCase,
    private obtenerHorariosCU: ObtenerHorariosUseCase,
    private asignarServicioUC: AsignarServicioBarberoUseCase,
    private listarServiciosBarberoUC: ListarServiciosBarberoUseCase,
    private eliminarServicioBarberoUC: EliminarServicioBarberoUseCase,
    private listarBarberoPorServicioCU: ListarBarberosPorServicioUseCase) { }

  public registrar(barbero: RegisterBarberoDTO): Observable<any> {
    return this.registrarBarberoUseCase.execute(barbero);
  }

  public listarBarberos(): Observable<BarberoDTORespuesta[]> {
    return this.listarBarberosUseCase.execute();
  }

  public actualizarBarbero(id: number, barbero: BarberoDTORespuesta): Observable<any> {
    return this.actualizarBarberoUseCase.execute(id, barbero);
  }

  public guardarHorarios(horarios: HorarioLaboralDTOPeticion[]): Observable<any> {
    return this.guardarHorariosCU.execute(horarios);
  }

  public obtenerHorarios(idBarbero: number): Observable<HorarioLaboralDTORespuesta[]> {
    return this.obtenerHorariosCU.execute(idBarbero);
  }

  public asignarServicio(dto: BarberoServicioPeticionDTO): Observable<BarberoServicioRespuestaDTO> {
    return this.asignarServicioUC.execute(dto);
  }

  public listarServiciosAsignados(barberoId: number): Observable<BarberoServicioRespuestaDTO[]> {
    return this.listarServiciosBarberoUC.execute(barberoId);
  }

  public desasignarServicio(barberoId: number, servicioId: number): Observable<void> {
    return this.eliminarServicioBarberoUC.execute(barberoId, servicioId);
  }

  public listarBarberosPorServicio(servicioId: number): Observable<BarberoServicioRespuestaDTO[]> {
    return this.listarBarberoPorServicioCU.execute(servicioId);
  }


}