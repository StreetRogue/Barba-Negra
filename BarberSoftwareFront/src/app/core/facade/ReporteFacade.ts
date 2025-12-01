import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ReportePeticionDTO } from "../domain/models/DTOs/Reportes/ReportePeticionDTO"; 
import { ReporteRespuestaDTO } from "../domain/models/DTOs/Reportes/ReporteRespuestaDTO"; 

import { ObtenerReporteKPIUseCase } from "../application/reporteCU/ObtenerReporteKPICU";
import { HistorialReservaUseCase } from "../application/reporteCU/HistorialReservasCU";
import { HistorialReservaDTORespuesta } from "../domain/models/DTOs/Reportes/HistorialReservaDTORespuesta";

@Injectable({
  providedIn: "root"
})
export class ReporteFacade {

  constructor(
    private obtenerKPIUC: ObtenerReporteKPIUseCase,
    private historialUC: HistorialReservaUseCase
  ) {}

  obtenerReporteKPI(filtro: ReportePeticionDTO): Observable<ReporteRespuestaDTO> {
    return this.obtenerKPIUC.execute(filtro);
  }

  historialReserva(idReserva: number): Observable<HistorialReservaDTORespuesta[]> {
    return this.historialUC.execute(idReserva);
  }
}
