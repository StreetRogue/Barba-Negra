import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaRepository } from '../../domain/repositories/ReservaRepository';
import { ReservaDTOPeticion } from '../../domain/models/DTOs/Reserva/ReservaDTOPeticion';
import { ReservaDTORespuesta } from '../../domain/models/DTOs/Reserva/ReservaDTORespuesta';
import { environment } from '../../../../environments/environment'; 

@Injectable({ providedIn: 'root' })
export class ReservaRepositoryImpl extends ReservaRepository {

  // URL al Gateway -> MicroReservas
  private apiUrl = `${environment.apiGatewayUrl}/api/v1/microReservas`; 

  constructor(private http: HttpClient) { super(); }

  // 1. Crear
  crearReserva(peticion: ReservaDTOPeticion): Observable<ReservaDTORespuesta> {
    return this.http.post<ReservaDTORespuesta>(`${this.apiUrl}/reservas`, peticion);
  }

  // 2. Iniciar (POST /reservas/{id}/iniciar)
  iniciarReserva(idReserva: number): Observable<ReservaDTORespuesta> {
    return this.http.post<ReservaDTORespuesta>(`${this.apiUrl}/reservas/${idReserva}/iniciar`, {});
  }

  // 3. Cancelar (POST /reservas/{id}/cancelar)
  cancelarReserva(idReserva: number): Observable<ReservaDTORespuesta> {
    return this.http.post<ReservaDTORespuesta>(`${this.apiUrl}/reservas/${idReserva}/cancelar`, {});
  }

  // 4. Reprogramar (PUT /reservas/{id}/reprogramar)
  reprogramarReserva(idReserva: number, nuevosDatos: ReservaDTOPeticion): Observable<ReservaDTORespuesta> {
    return this.http.put<ReservaDTORespuesta>(`${this.apiUrl}/reservas/${idReserva}/reprogramar`, nuevosDatos);
  }

  // 5. Completar (POST /reservas/{id}/completar)
  completarReserva(idReserva: number): Observable<ReservaDTORespuesta> {
    return this.http.post<ReservaDTORespuesta>(`${this.apiUrl}/reservas/${idReserva}/completar`, {});
  }

  // 6. No Presentado (POST /reservas/{id}/ausencia)
  marcarNoPresentado(idReserva: number): Observable<ReservaDTORespuesta> {
    return this.http.post<ReservaDTORespuesta>(`${this.apiUrl}/reservas/${idReserva}/ausencia`, {});
  }

  // 7. Listar Todas (GET /reservas)
  listarTodas(): Observable<ReservaDTORespuesta[]> {
    return this.http.get<ReservaDTORespuesta[]>(`${this.apiUrl}/reservas`);
  }

   listarMisReservas(): Observable<ReservaDTORespuesta[]> {
    return this.http.get<ReservaDTORespuesta[]>(`${this.apiUrl}/mis-reservas`);
  }

  // GET: /reservas/{id}
  consultarReserva(idReserva: number): Observable<ReservaDTORespuesta> {
    return this.http.get<ReservaDTORespuesta>(`${this.apiUrl}/reservas/${idReserva}`);
  }

  listarReservasPorBarbero(): Observable<ReservaDTORespuesta[]> {
    return this.http.get<ReservaDTORespuesta[]>(`${this.apiUrl}/mis-citas-barbero`);
  }

  listarAgendaHoyBarbero(idBarbero: number): Observable<ReservaDTORespuesta[]> {
    return this.http.get<ReservaDTORespuesta[]>(`${this.apiUrl}/reservas/barbero/${idBarbero}/hoy`);
  }
}