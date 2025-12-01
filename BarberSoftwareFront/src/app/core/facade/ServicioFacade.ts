import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListarServiciosUseCase } from '../application/servicioCU/ListarServicioCU'; 
import { CrearServicioUseCase } from '../application/servicioCU/CrearServicioCU';
import { ActualizarServicioUseCase } from '../application/servicioCU/ActualizarServicioCU';
import { EliminarServicioUseCase } from '../application/servicioCU/EliminarServicioCU';
import { ListarServiciosPorCategoriaUseCase } from '../application/servicioCU/ListarPorCategoriaCU';
import { ListarServiciosActivosPorCategoriaUseCase } from '../application/servicioCU/ListarServiciosActivosCategoriaCU'; 
import { ServicioDTOPeticion } from '../domain/models/DTOs/Servicio/ServicioPeticionDTO';
import { ServicioDTORespuesta } from '../domain/models/DTOs/Servicio/ServicioRespuestaDTO';
import { ConsultarServicioUseCase } from '../application/servicioCU/ConsultaServicioCU';

@Injectable({
  providedIn: 'root'
})
export class ServicioFacade {
  constructor(
    private listarCU: ListarServiciosUseCase,
    private crearCU: CrearServicioUseCase,
    private actualizarCU: ActualizarServicioUseCase,
    private eliminarCU: EliminarServicioUseCase,
    private listarPorCategoriaCU: ListarServiciosPorCategoriaUseCase,
    private consultarServicioCU: ConsultarServicioUseCase,
    private listarActivosPorCategoriaCU: ListarServiciosActivosPorCategoriaUseCase
  ) {}

  public listar(): Observable<ServicioDTORespuesta[]> {
    return this.listarCU.execute();
  }

  public crear(servicio: ServicioDTOPeticion): Observable<ServicioDTORespuesta> {
    return this.crearCU.execute(servicio);
  }

  public actualizar(id: number, servicio: ServicioDTOPeticion): Observable<ServicioDTORespuesta> {
    return this.actualizarCU.execute(id, servicio);
  }

  public eliminar(id: number): Observable<void> {
    return this.eliminarCU.execute(id);
  }

  public consultar(id: number): Observable<ServicioDTORespuesta> {
    return this.consultarServicioCU.execute(id);
  }

  public listarPorCategoria(idCategoria: number): Observable<ServicioDTORespuesta[]> {
    return this.listarPorCategoriaCU.execute(idCategoria);
  }

  public listarActivosPorCategoria(idCategoria: number): Observable<ServicioDTORespuesta[]> {
    return this.listarActivosPorCategoriaCU.execute(idCategoria);
  }
}