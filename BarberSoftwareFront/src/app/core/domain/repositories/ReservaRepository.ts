import { Observable } from 'rxjs';
import { ReservaDTOPeticion } from '../models/DTOs/Reserva/ReservaDTOPeticion';
import { ReservaDTORespuesta } from '../models/DTOs/Reserva/ReservaDTORespuesta';

export abstract class ReservaRepository {
    abstract crearReserva(peticion: ReservaDTOPeticion): Observable<ReservaDTORespuesta>;
    abstract iniciarReserva(idReserva: number): Observable<ReservaDTORespuesta>;
    abstract cancelarReserva(idReserva: number): Observable<ReservaDTORespuesta>;
    abstract reprogramarReserva(idReserva: number, nuevosDatos: ReservaDTOPeticion): Observable<ReservaDTORespuesta>;
    abstract completarReserva(idReserva: number): Observable<ReservaDTORespuesta>;
    abstract marcarNoPresentado(idReserva: number): Observable<ReservaDTORespuesta>;
    abstract listarTodas(): Observable<ReservaDTORespuesta[]>;
    abstract listarMisReservas(): Observable<ReservaDTORespuesta[]>;
    abstract consultarReserva(idReserva: number): Observable<ReservaDTORespuesta>;
    abstract listarReservasPorBarbero(): Observable<ReservaDTORespuesta[]>;
    abstract listarAgendaHoyBarbero(idBarbero: number): Observable<ReservaDTORespuesta[]>;
}