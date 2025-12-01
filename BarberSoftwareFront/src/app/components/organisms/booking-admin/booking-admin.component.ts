import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// Arquitectura
import { ReservaFacade } from '../../../core/facade/ReservaFacade';
import { ReservaDTORespuesta } from '../../../core/domain/models/DTOs/Reserva/ReservaDTORespuesta';

@Component({
  selector: 'app-booking-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-admin.component.html',
  styleUrl: './booking-admin.component.css'
})
export class BookingAdminComponent implements OnInit {

  reservas: ReservaDTORespuesta[] = [];
  reservasFiltradas: ReservaDTORespuesta[] = [];
  loading = true;
  filtro: string = '';

  // Opciones de filtro de estado
  filtroEstado: string = 'TODOS'; // TODOS, PENDIENTE, CONFIRMADA...

  constructor(private reservaFacade: ReservaFacade) {}

  ngOnInit(): void {
    this.cargarTodasLasReservas();
  }

  cargarTodasLasReservas() {
    this.loading = true;
    this.reservaFacade.listarTodas().subscribe({
      next: (data) => {
        // Ordenar: Más recientes primero
        this.reservas = data.sort((a, b) => new Date(b.horaInicio).getTime() - new Date(a.horaInicio).getTime());
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar el historial de reservas', 'error');
      }
    });
  }

  aplicarFiltros() {
    const term = this.filtro.toLowerCase();
    
    this.reservasFiltradas = this.reservas.filter(r => {
      // Filtro de Texto (Busca por ID de reserva o ID de cliente)
      const matchesText = r.idReserva.toString().includes(term) || 
                          r.idUsuario.toString().includes(term);

      // Filtro de Estado
      const matchesStatus = this.filtroEstado === 'TODOS' || r.estado === this.filtroEstado;

      return matchesText && matchesStatus;
    });
  }

  // --- HELPERS VISUALES ---

  formatDate(isoString: string): string {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('es-CO', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    });
  }

  formatTime(isoString: string): string {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('en-US', { 
      hour: '2-digit', minute: '2-digit' 
    });
  }

  getStatusClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'status-pending';
      case 'CONFIRMADA': return 'status-confirmed';
      case 'REPROGRAMADA': return 'status-rescheduled';
      case 'EN_PROCESO': return 'status-progress';
      case 'COMPLETADA': return 'status-completed';
      case 'CANCELADA': return 'status-cancelled';
      case 'NO_PRESENTADO': return 'status-noshow';
      default: return 'status-default';
    }
  }

  getStatusLabel(estado: string): string {
    return estado.replace('_', ' ');
  }
}