import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../core/domain/models/Servicio';
import { ServicioFacade } from '../../../core/facade/ServicioFacade';
import { EditarServicioModalComponent } from './editar-servicio-modal.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-producto',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    CurrencyPipe, // Para formatear el precio
    EditarServicioModalComponent // Modal
  ],
  templateUrl: './listar-producto.component.html',
  styleUrl: './listar-producto.component.css'
})
export class ListarProductoComponent implements OnInit {

  // --- Inyección de Servicios ---
  constructor(private servicioFacade: ServicioFacade) { }
  // --- Signals para el Estado Reactivo ---
  private allServices = signal<Servicio[]>([]);
  public searchTerm = signal<string>('');
  public selectedService = signal<Servicio | null>(null);

  // Esto se recalcula automáticamente cada vez que 'allServices' o 'searchTerm' cambian.
  public filteredServices = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (term === '') {
      return this.allServices(); //  Muestra todo
    }

    // Filtra por nombre o descripción
    return this.allServices().filter(s =>
      s.nombre.toLowerCase().includes(term) ||
      s.descripcion.toLowerCase().includes(term)
    );
  });



  ngOnInit(): void {
    // Cargar los servicios
    this.servicioFacade.loadServicios();

    // Suscribirse al flujo de servicios
    this.servicioFacade.servicios$.subscribe({
      next: (servicios) => this.allServices.set(servicios),
      error: (err) => console.error('Error en la suscripción de servicios', err)
    });
  }



  // --- Métodos de Acción ---
  onEdit(servicio: Servicio): void {
    // Abre el modal al establecer el servicio seleccionado
    // Hacemos una copia para no modificar la lista original si cancela
    this.selectedService.set({ ...servicio });
  }

  onDelete(servicio: Servicio): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `No podrás revertir la eliminación de "${servicio.nombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioFacade.delete(servicio.id).subscribe({
          next: () => {
            // Actualiza el signal local para quitar el servicio
            this.allServices.update(services =>
              services.filter(s => s.id !== servicio.id)
            );
            Swal.fire('Eliminado', `"${servicio.nombre}" ha sido eliminado.`, 'success');
          },
          error: (err) => {
            console.error("Error eliminando servicio:", err);
            Swal.fire('Error', 'No se pudo eliminar el servicio.', 'error');
          }
        });
      }
    });
  }

  onModalClose(): void {
    this.selectedService.set(null);
  }

  onModalSave(): void {
    this.selectedService.set(null);
    this.servicioFacade.loadServicios(); 
  }
}
