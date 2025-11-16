import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Servicio } from '../domain/models/Servicio';
import { 
  GetServiciosUseCase,
  GetServiciosPorCategoriaUseCase,
  GetServiciosClienteUseCase,
  GetServiciosClientePorCategoriaUseCase,
  GetServicioByIdUseCase,
  CreateServicioUseCase,
  UpdateServicioUseCase,
  DeleteServicioUseCase
} from '../application/servicioCU'; 

@Injectable({
  providedIn: 'root'
})
export class ServicioFacade {
  private serviciosSubject = new BehaviorSubject<Servicio[]>([]);
  servicios$ = this.serviciosSubject.asObservable();

  constructor(
    private getServicios: GetServiciosUseCase,
    private getServiciosPorCategoria: GetServiciosPorCategoriaUseCase,
    private getServiciosCliente: GetServiciosClienteUseCase,
    private getServiciosClientePorCategoria: GetServiciosClientePorCategoriaUseCase,
    private getServicioById: GetServicioByIdUseCase,
    private createServicio: CreateServicioUseCase,
    private updateServicio: UpdateServicioUseCase,
    private deleteServicio: DeleteServicioUseCase
  ) {}

  loadServicios(): void {
    this.getServicios.execute().subscribe({
      next: servicios => this.serviciosSubject.next(servicios),
      error: err => console.error('Error al cargar servicios', err)
    });
  }

  getServiciosPorCategoria$(idCategoria: number): Observable<Servicio[]> {
    return this.getServiciosPorCategoria.execute(idCategoria);
  }

  getServicioById$(id: number): Observable<Servicio> {
    return this.getServicioById.execute(id);
  }

  getServiciosCliente$(): Observable<Servicio[]> {
    return this.getServiciosCliente.execute();
  }

  getServiciosClientePorCategoria$(idCategoria: number): Observable<Servicio[]> {
    return this.getServiciosClientePorCategoria.execute(idCategoria);
  }

  create(servicio: Servicio): Observable<Servicio> {
    return this.createServicio.execute(servicio);
  }

  update(servicio: Servicio): Observable<Servicio> {
    return this.updateServicio.execute(servicio);
  }

  delete(id: number): Observable<void> {
    return this.deleteServicio.execute(id);
  }
}
