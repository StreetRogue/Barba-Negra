import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { ReporteRepository } from "../../domain/repositories/ReporteRepository";
import { ReportePeticionDTO } from "../../domain/models/DTOs/Reportes/ReportePeticionDTO";
import { ReporteRespuestaDTO } from "../../domain/models/DTOs/Reportes/ReporteRespuestaDTO";
import { HistorialReservaDTORespuesta } from "../../domain/models/DTOs/Reportes/HistorialReservaDTORespuesta";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ReporteRepositoryImpl extends ReporteRepository {

  private baseUrl = `${environment.apiGatewayUrl}/api/v1/microReservas/reportes`;

  constructor(private http: HttpClient) {
    super();
  }

  // ========================================
  // OBTENER KPIs
  // ========================================
  override obtenerReporteKPI(filtros: ReportePeticionDTO): Observable<ReporteRespuestaDTO> {

    let params = new HttpParams()
      .set("fechaInicio", filtros.fechaInicio)
      .set("fechaFin", filtros.fechaFin);

    // 🔥 FIX: NO enviar undefined/null
    if (filtros.idBarbero !== undefined && filtros.idBarbero !== null) {
      params = params.set("idBarbero", filtros.idBarbero.toString());
    }

    if (filtros.idServicio !== undefined && filtros.idServicio !== null) {
      params = params.set("idServicio", filtros.idServicio.toString());
    }

    return this.http.get<ReporteRespuestaDTO>(`${this.baseUrl}/estadisticas`, { params });
  }

  // ========================================
  // CONSULTAR HISTORIAL DE UNA RESERVA
  // ========================================
  consultarHistorialReserva(idReserva: number): Observable<HistorialReservaDTORespuesta[]> {
    return this.http.get<HistorialReservaDTORespuesta[]>(
      `${this.baseUrl}/historial/${idReserva}`
    );
  }
}
