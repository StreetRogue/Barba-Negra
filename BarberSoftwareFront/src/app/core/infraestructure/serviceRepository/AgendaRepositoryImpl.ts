import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgendaRepository } from '../../domain/repositories/AgendaRepository';
import { SlotDTORespuesta } from '../../domain/models/DTOs/Agenda/SlotRespuestaDTO'; 
import { environment } from '../../../../environments/environment'; 

@Injectable({ providedIn: 'root' })
export class AgendaRepositoryImpl extends AgendaRepository {

  // Apunta a microReservas
  private apiUrl = `${environment.apiGatewayUrl}/api/v1/microReservas/agendas`; 

  constructor(private http: HttpClient) { super(); }

  obtenerSlotsDisponibles(idBarbero: number, idServicio: number, fecha: string): Observable<SlotDTORespuesta[]> {
    // URL: /slots?idBarbero=X&idServicio=Y&fecha=YYYY-MM-DD
    let params = new HttpParams()
        .set('idBarbero', idBarbero)
        .set('idServicio', idServicio)
        .set('fecha', fecha);

    return this.http.get<SlotDTORespuesta[]>(`${this.apiUrl}/slots`, { params });
  }
}