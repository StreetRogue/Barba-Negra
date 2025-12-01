import { Observable } from 'rxjs';
import { ServicioDTOPeticion } from '../models/DTOs/Servicio/ServicioPeticionDTO';
import { ServicioDTORespuesta } from '../models/DTOs/Servicio/ServicioRespuestaDTO';

export abstract class ServicioRepository {
    abstract listarServicios(): Observable<ServicioDTORespuesta[]>;
    abstract crearServicio(servicio: ServicioDTOPeticion): Observable<ServicioDTORespuesta>;
    abstract actualizarServicio(id: number, servicio: ServicioDTOPeticion): Observable<ServicioDTORespuesta>;
    abstract eliminarServicio(id: number): Observable<void>;
    abstract consultarServicio(id: number): Observable<ServicioDTORespuesta>; 
    abstract listarServiciosPorCategoria(idCategoria: number): Observable<ServicioDTORespuesta[]>;
    abstract listarServiciosActivosPorCategoria(idCategoria: number): Observable<ServicioDTORespuesta[]>;
}