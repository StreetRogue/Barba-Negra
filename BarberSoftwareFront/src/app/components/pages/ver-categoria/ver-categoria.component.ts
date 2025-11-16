import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// Importamos los servicios y modelos
import { CategoriaFacade } from '../../../core/facade/CategoriaFacade'; 
import { ServicioFacade } from '../../../core/facade/ServicioFacade';
import { ICategoria } from '../../../core/domain/models/ICategoria'; 
import { Servicio } from '../../../core/domain/models/Servicio'; 
import { toSignal } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2'; // Importamos Swal para errores

@Component({
  selector: 'app-ver-por-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, SlicePipe],
  templateUrl: './ver-categoria.component.html', // Corregido: el nombre de tu archivo era ver-categoria.component.html
  styleUrl: './ver-categoria.component.css'
})
export class VerPorCategoriaComponent implements OnInit {

  constructor(
    private categoriaFacade: CategoriaFacade,
    private servicioFacade: ServicioFacade
  ) { }

  // --- Signals para el Estado Reactivo ---
  public allCategories = toSignal(this.categoriaFacade.categorias$, { initialValue: [] as ICategoria[] });
  public activeServices = signal<Servicio[]>([]); // Los servicios que se muestran
  public selectedCategory = signal<ICategoria | null>(null);
  public isLoading = signal<boolean>(true); // Para las categorías
  public isLoadingServices = signal<boolean>(false); // Para los servicios
  public currentTitle = computed(() => {
    const categoria = this.selectedCategory();
    return categoria ? `Servicios de ${categoria.nombre}` : 'Todos los Servicios';
  });

  ngOnInit(): void {
    this.loadCategorias();
  }

  // --- Lógica de Carga Optimizada ---
  selectCategory(categoria: ICategoria | null): void {
    this.selectedCategory.set(categoria);
    this.isLoadingServices.set(true);

    // Determinar endpoint según categoría
    const apiCall =
      categoria === null
        ? this.servicioFacade.getServiciosCliente$()
        : this.servicioFacade.getServiciosPorCategoria$(categoria.id);

    apiCall.subscribe({
      next: (servicios) => {
        this.activeServices.set(servicios);
        this.isLoadingServices.set(false);
      },
      error: (err) =>
        this.handleError(
          categoria ? `servicios para ${categoria.nombre}` : 'todos los servicios',
          err
        ),
    });
  }

  // --- Funciones TrackBy para optimizar los bucles @for ---
  trackById(index: number, categoria: ICategoria): number {
    return categoria.id;
  }
  trackByServiceId(index: number, servicio: Servicio): number {
    return servicio.id;
  }

  // --- Manejador de Errores ---
  private handleError(tipo: string, err: any): void {
    console.error(`Error cargando ${tipo}:`, err);
    this.isLoading.set(false);
    this.isLoadingServices.set(false);
    Swal.fire('Error', `No se pudieron cargar ${tipo}.`, 'error');
  }

  private loadCategorias(): void {
    this.isLoading.set(true);

    this.categoriaFacade.loadCategorias(); // Carga inicial

    // Cuando termine de cargar categorías, cargamos los servicios
    this.categoriaFacade.getCategorias().subscribe({
      next: () => {
        this.selectCategory(null);
        this.isLoading.set(false);
      },
      error: (err) => this.handleError('categorías', err)
    });
  }

  
}