import { Component, OnInit, signal, computed, Signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Servicio } from '../../../core/domain/models/Servicio';
import { ICategoria } from '../../../core/domain/models/ICategoria';
import { CategoriaFacade } from '../../../core/facade/CategoriaFacade'; 
import { ServicioFacade } from '../../../core/facade/ServicioFacade';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-servicio-catalogo',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './servicio-catalogo.component.html',
  styleUrl: './servicio-catalogo.component.css'
})
export class ServicioCatalogoComponent implements OnInit {

  constructor(
    private servicioFacade: ServicioFacade,
    private categoriaFacade: CategoriaFacade
  ) { }

  // --- Signals de Estado ---
  public isLoading = signal<boolean>(true);
  public selectedCategoryId = signal<number | null>(null);
  public allCategories: Signal<ICategoria[]> = toSignal(this.categoriaFacade.categorias$,{ initialValue: [] });
  public filteredServices = signal<Servicio[]>([]);

  // 'currentTitle' sigue funcionando porque depende de signals que aún existen.
  public currentTitle = computed(() => {
    const categoryId = this.selectedCategoryId();
    if (categoryId === null) return 'Todos los Servicios';
    const category = this.allCategories().find(c => c.id === categoryId);
    return category ? category.nombre : 'Servicios';
  });




  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    this.categoriaFacade.loadCategorias();

    this.servicioFacade.getServiciosCliente$().subscribe({
      next: (servicios) => {
        this.filteredServices.set(servicios);
        this.isLoading.set(false);
      },
      error: (err) => this.handleError(err)
    });
  }

  selectCategory(id: number | null): void {
    this.selectedCategoryId.set(id);
    this.isLoading.set(true);

    const apiCall = id === null ? this.servicioFacade.getServiciosCliente$() : this.servicioFacade.getServiciosClientePorCategoria$(id);

    apiCall.subscribe({
      next: (servicios) => {
        this.filteredServices.set(servicios);
        this.isLoading.set(false);
      },
      error: (err) => this.handleError(err)
    });
  }

  private handleError(err: any): void {
    console.error("Error cargando datos:", err);
    this.isLoading.set(false);
    Swal.fire(
      'Error',
      'No se pudieron cargar los datos. Por favor, intente más tarde.',
      'error'
    );
  }
}

