import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BarberoRepository } from '../../domain/repositories/BarberRepository';
import { RegisterBarberoDTO } from '../../domain/models/DTOs/Barbero/RegisterBarberoDTO';
import { BarberoDTORespuesta } from '../../domain/models/DTOs/Barbero/BarberoRespuestaDTO';
import { HorarioLaboralDTOPeticion } from '../../domain/models/DTOs/Horarios/HorarioLaboralPeticionDTO';
import { HorarioLaboralDTORespuesta } from '../../domain/models/DTOs/Horarios/HorarioLaboralRespuestaDTO';
import { BarberoServicioRespuestaDTO } from '../../domain/models/DTOs/BarberoServicio/BarberoServicioRespuestaDTO';
import { BarberoServicioPeticionDTO } from '../../domain/models/DTOs/BarberoServicio/BarberoServicioPeticionDTO';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BarberoRepositoryImpl extends BarberoRepository {
  // URL base para Usuarios (Auth/Registro)
  private apiUrl = `${environment.apiGatewayUrl}/api/v1/usuarios`;
  // URL base para Microservicio Barberos (Datos de negocio)
  private urlBarbero = `${environment.apiGatewayUrl}/api/v1/microBarberos`;


  constructor(private http: HttpClient) {
    super();
  }

  registrarBarbero(barbero: RegisterBarberoDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro-barbero`, barbero);
  }

  listarBarberos(): Observable<BarberoDTORespuesta[]> {
    return this.http.get<BarberoDTORespuesta[]>(`${this.urlBarbero}/barberos`);
  }

  actualizarBarbero(id: number, barbero: BarberoDTORespuesta): Observable<any> {
    const url = `${this.urlBarbero}/actualizarBarbero/${id}`;
    return this.http.put<any>(url, barbero);
  }

  guardarHorarios(horarios: HorarioLaboralDTOPeticion[]): Observable<any> {
    return this.http.post<any>(`${this.urlBarbero}/horarios/configuracion-semanal`, horarios);
  }

  obtenerHorariosPorBarbero(idBarbero: number): Observable<HorarioLaboralDTORespuesta[]> {
    return this.http.get<HorarioLaboralDTORespuesta[]>(`${this.urlBarbero}/barbero/${idBarbero}/horarios`);
  }

   asignarServicio(peticion: BarberoServicioPeticionDTO): Observable<BarberoServicioRespuestaDTO> {
    return this.http.post<BarberoServicioRespuestaDTO>(`${this.urlBarbero}/barberoServicio`, peticion);
  }


  listarServiciosPorBarbero(barberoId: number): Observable<BarberoServicioRespuestaDTO[]> {
    return this.http.get<BarberoServicioRespuestaDTO[]>(`${this.urlBarbero}/barberoServicio/barbero/${barberoId}`);
  }

 
  eliminarServicioDelBarbero(barberoId: number, servicioId: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBarbero}/barberoServicio/barbero/${barberoId}/servicio/${servicioId}`);
  }

  listarBarberosPorServicio(servicioId: number): Observable<BarberoServicioRespuestaDTO[]> {
    return this.http.get<BarberoServicioRespuestaDTO[]>(`${this.urlBarbero}/barberoServicio/servicio/${servicioId}`);
  }

}