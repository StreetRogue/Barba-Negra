import { Observable } from "rxjs";
import { ReporteRespuestaDTO } from "../models/DTOs/Reportes/ReporteRespuestaDTO";
import { ReportePeticionDTO } from "../models/DTOs/Reportes/ReportePeticionDTO"; 
import { HistorialReservaDTORespuesta } from "../models/DTOs/Reportes/HistorialReservaDTORespuesta";

export abstract class ReporteRepository {
    abstract obtenerReporteKPI(filtros: ReportePeticionDTO): Observable<ReporteRespuestaDTO>;
    abstract consultarHistorialReserva(idReserva: number): Observable<HistorialReservaDTORespuesta[]>;
}
