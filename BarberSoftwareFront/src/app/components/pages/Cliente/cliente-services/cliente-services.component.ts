import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "../../../atoms/card/card.component";
import { BookingModalComponent } from '../../../organisms/booking-modal/booking-modal.component';
import Swal from 'sweetalert2';

// Imports de Arquitectura
import { ServicioFacade } from '../../../../core/facade/ServicioFacade';
import { ServicioDTORespuesta } from '../../../../core/domain/models/DTOs/Servicio/ServicioRespuestaDTO';

@Component({
  selector: 'app-cliente-services',
  standalone: true,
  imports: [CardComponent, CommonModule, BookingModalComponent],
  templateUrl: './cliente-services.component.html',
  styleUrl: './cliente-services.component.css'
})
export class ClienteServicesComponent implements OnInit {

  showBookingModal = false;
  selectedService: any = null;
  
  // Array que se llenará con datos reales
  services: any[] = []; 
  activeIndex = 0;

  promotions = [
    { id: 1, title: 'Primera Visita', discount: '20%', description: 'Descuento exclusivo para nuevos clientes.', code: 'NUEVO20', expiry: 'Vence en 2 días', bgType: 'gold' },
    { id: 2, title: 'Combo Barba + Corte', discount: '$5.000', description: 'Ahorra al agendar el paquete completo.', code: 'COMBO5', expiry: 'Cupos limitados', bgType: 'dark' },
    { id: 3, title: 'Happy Hour', discount: '15%', description: 'Válido de Martes a Jueves (2pm - 4pm).', code: 'HAPPY15', expiry: 'Semanal', bgType: 'dark' }
  ];

  copiedCode: string | null = null;

  constructor(private servicioFacade: ServicioFacade) {}

  ngOnInit(): void {
    this.cargarServiciosActivos();
  }

  cargarServiciosActivos() {
    this.servicioFacade.listar().subscribe({
      next: (data: ServicioDTORespuesta[]) => {
        // Filtramos solo los ACTIVOS para el cliente
        const activos = data.filter(s => s.estado === 'ACTIVO');
        
        // Mapeamos al formato que espera tu HTML
        this.services = activos.map(s => ({
          id: s.id,
          name: s.nombre,
          price: `$ ${s.precio.toLocaleString('es-CO')} COP`, 
          img: s.imagenBase64 || 'assets/images/default-service.jpg', 
          duration: s.duracionMinutos,
          description: s.descripcion
        }));

        // Centrar el carrusel
        if (this.services.length > 0) {
          this.activeIndex = Math.floor(this.services.length / 2);
        }
      },
      error: (err) => console.error('Error cargando servicios', err)
    });
  }

  // --- Lógica Carrusel ---
  next() {
    if (this.services.length > 0)
      this.activeIndex = (this.activeIndex + 1) % this.services.length;
  }

  prev() {
    if (this.services.length > 0)
      this.activeIndex = (this.activeIndex - 1 + this.services.length) % this.services.length;
  }

  getClass(index: number): string {
    if (this.services.length === 0) return 'card-hidden';
    if (index === this.activeIndex) return 'card-center';

    const total = this.services.length;
    // Lógica circular robusta para n elementos
    const prevIndex = (this.activeIndex - 1 + total) % total;
    const nextIndex = (this.activeIndex + 1) % total;

    if (index === prevIndex) return 'card-left';
    if (index === nextIndex) return 'card-right';

    return 'card-hidden';
  }

  confirmBooking(service: any) {
    Swal.fire({
      title: '¿Reservar Servicio?',
      text: `¿Deseas iniciar la reserva para "${service.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'No, cancelar',
      background: '#1e1e1e',
      color: '#fff',
      confirmButtonColor: '#FFC107',
      cancelButtonColor: '#d33',
      customClass: {
        confirmButton: 'btn-confirm-swal',
        popup: 'dark-swal-popup'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.selectedService = service;
        this.showBookingModal = true;
      }
    });
  }

  copyPromoCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.copiedCode = code;
      setTimeout(() => { this.copiedCode = null; }, 2000);
    });
  }
}