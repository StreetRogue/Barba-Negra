import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ReporteRepository } from "../../domain/repositories/ReporteRepository";
import { HistorialReservaDTORespuesta } from "../../domain/models/DTOs/Reportes/HistorialReservaDTORespuesta";

@Injectable({
  providedIn: "root"
})
export class HistorialReservaUseCase {

  constructor(private repository: ReporteRepository) {}

  execute(idReserva: number): Observable<HistorialReservaDTORespuesta[]> {
    return this.repository.consultarHistorialReserva(idReserva);
  }
}
