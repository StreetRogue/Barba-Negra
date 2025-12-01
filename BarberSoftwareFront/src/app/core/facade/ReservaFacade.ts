import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// --- IMPORTS DE CASOS DE USO ---
import { CrearReservaUseCase } from '../application/reservaCU/CrearReservaCU';
import { IniciarReservaUseCase } from '../application/reservaCU/IniciarReserva'; 
import { CancelarReservaUseCase } from '../application/reservaCU/CancelarReservaCU';
import { ReprogramarReservaUseCase } from '../application/reservaCU/ReprogramarReservaCU';
import { CompletarReservaUseCase } from '../application/reservaCU/CompletarReservaCU';
import { MarcarNoPresentadoUseCase } from '../application/reservaCU/MarcarNoPresentadoCU';
import { ListarReservasUseCase } from '../application/reservaCU/ListarTodasCU';
import { ListarAgendaHoyBarberoUseCase } from '../application/reservaCU/ListarAgendaHoyBarberoCU';

// --- IMPORTS DE DTOs ---
import { ReservaDTOPeticion } from '../domain/models/DTOs/Reserva/ReservaDTOPeticion';
import { ReservaDTORespuesta } from '../domain/models/DTOs/Reserva/ReservaDTORespuesta';
import { ListarMisReservasUseCase } from '../application/reservaCU/ListarReservasClienteCU';
import { ConsultarReservaUseCase } from '../application/reservaCU/ConsultarReservasClienteCU';
import { ListarReservasBarberoUseCase } from '../application/reservaCU/ListarReservasBarberoCU';


@Injectable({
  providedIn: 'root'
})
export class ReservaFacade {

  constructor(
    private crearReservaUC: CrearReservaUseCase,
    private iniciarReservaUC: IniciarReservaUseCase,
    private cancelarReservaUC: CancelarReservaUseCase,
    private reprogramarReservaUC: ReprogramarReservaUseCase,
    private completarReservaUC: CompletarReservaUseCase,
    private noPresentadoUC: MarcarNoPresentadoUseCase,
    private listarReservasUC: ListarReservasUseCase,
    private listarReservasClienteCU: ListarMisReservasUseCase,
    private consultarReservaCU: ConsultarReservaUseCase,
    private listarReservasBarbero: ListarReservasBarberoUseCase,
    private listarAgendaHoyBarberoUC: ListarAgendaHoyBarberoUseCase
  ) {}

  // 1. CREAR UNA NUEVA RESERVA
  public crear(peticion: ReservaDTOPeticion): Observable<ReservaDTORespuesta> {
    return this.crearReservaUC.execute(peticion);
  }

  // 2. INICIAR EL SERVICIO (El barbero marca que empezó)
  public iniciar(idReserva: number): Observable<ReservaDTORespuesta> {
    return this.iniciarReservaUC.execute(idReserva);
  }

  // 3. CANCELAR LA RESERVA (Cliente o Barbero)
  public cancelar(idReserva: number): Observable<ReservaDTORespuesta> {
    return this.cancelarReservaUC.execute(idReserva);
  }

  // 4. REPROGRAMAR (Cambiar fecha/hora o barbero)
  public reprogramar(idReserva: number, nuevosDatos: ReservaDTOPeticion): Observable<ReservaDTORespuesta> {
    return this.reprogramarReservaUC.execute(idReserva, nuevosDatos);
  }

  // 5. COMPLETAR SERVICIO (Finalizar con éxito)
  public completar(idReserva: number): Observable<ReservaDTORespuesta> {
    return this.completarReservaUC.execute(idReserva);
  }

  // 6. MARCAR NO PRESENTADO (Cliente no llegó)
  public marcarNoPresentado(idReserva: number): Observable<ReservaDTORespuesta> {
    return this.noPresentadoUC.execute(idReserva);
  }

  // 7. LISTAR TODAS LAS RESERVAS (Para paneles administrativos)
  public listarTodas(): Observable<ReservaDTORespuesta[]> {
    return this.listarReservasUC.execute();
  }

    // 7. LISTAR TODAS LAS RESERVAS (Para paneles administrativos)
  public listarMisReservas(): Observable<ReservaDTORespuesta[]> {
    return this.listarReservasClienteCU.execute();
  }

    // 7. LISTAR TODAS LAS RESERVAS (Para paneles administrativos)
  public consultarReserva(idReserva: number): Observable<ReservaDTORespuesta> {
    return this.consultarReservaCU.execute(idReserva);
  }

  public listarReservasPorBarbero(): Observable<ReservaDTORespuesta[]> {
    return this.listarReservasBarbero.execute();
  }

  public listarAgendaHoyBarbero(idBarbero: number): Observable<ReservaDTORespuesta[]> {
    return this.listarAgendaHoyBarberoUC.execute(idBarbero);
  }
}