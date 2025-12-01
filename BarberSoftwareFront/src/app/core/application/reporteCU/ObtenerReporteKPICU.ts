import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ReporteRepository } from "../../domain/repositories/ReporteRepository";
import { ReportePeticionDTO } from "../../domain/models/DTOs/Reportes/ReportePeticionDTO"; 
import { ReporteRespuestaDTO } from "../../domain/models/DTOs/Reportes/ReporteRespuestaDTO"; 

@Injectable({
  providedIn: "root"
})
export class ObtenerReporteKPIUseCase {

  constructor(private repository: ReporteRepository) {}

  execute(filtro: ReportePeticionDTO): Observable<ReporteRespuestaDTO> {
    return this.repository.obtenerReporteKPI(filtro);
  }
}
