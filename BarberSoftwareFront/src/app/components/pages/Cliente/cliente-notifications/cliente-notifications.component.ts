import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs'; // Para cargar múltiples datos a la vez
import Swal from 'sweetalert2';

// COMPONENTES HIJOS
import { EditBookingModalComponent } from '../../../organisms/edit-booking-modal/edit-booking-modal.component';

// FACHADAS (Nuestra conexión con el Back)
import { ReservaFacade } from '../../../../core/facade/ReservaFacade';
import { ServicioFacade } from '../../../../core/facade/ServicioFacade';
import { BarberoFacade } from '../../../../core/facade/BarberoFacade';

// DTOs
import { ReservaDTOPeticion } from '../../../../core/domain/models/DTOs/Reserva/ReservaDTOPeticion';
import { ReservaDTORespuesta } from '../../../../core/domain/models/DTOs/Reserva/ReservaDTORespuesta';

// Interfaz para la vista (Mapeada desde el DTO)
interface BookingUI {
  id: number;
  serviceName: string;
  barberName: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: string; // 'PENDIENTE', 'CONFIRMADA', 'CANCELADA', etc.
  price: number;
  duration: string;
  serviceCode: string;
  companyName: string;
  expanded?: boolean;
  idServicio: number;
  idBarbero: number;
}

@Component({
  selector: 'app-cliente-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, EditBookingModalComponent],
  templateUrl: './cliente-notifications.component.html',
  styleUrl: './cliente-notifications.component.css'
})
export class ClienteNotificationsComponent implements OnInit {
  
  @ViewChild('daysStrip') daysStrip!: ElementRef;

  // --- DATOS ---
  bookings: BookingUI[] = [];
  loading = true;
  
  // Mapas auxiliares para cruzar IDs con Nombres
  private serviciosMap = new Map<number, any>();
  private barberosMap = new Map<number, any>();

  // --- CALENDARIO ---
  currentDate: Date = new Date();
  selectedDateObj: Date = new Date();
  daysInMonth: Date[] = [];
  weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // --- BÚSQUEDA ---
  searchTerm: string = '';

  // --- MODAL EDICIÓN ---
  showEditModal = false;
  selectedBookingForEdit: any = null;

  constructor(
    private reservaFacade: ReservaFacade,
    private servicioFacade: ServicioFacade,
    private barberoFacade: BarberoFacade
  ) {}

  ngOnInit() {
    this.generateCalendar();
    this.cargarDatosCompletos();
    setTimeout(() => this.scrollToSelected(), 100);
  }

  refreshData() {
    this.cargarDatosCompletos();
  }

  // --- CARGA DE DATOS (CRUCE DE INFORMACIÓN) ---
  cargarDatosCompletos() {
    this.loading = true;

    // Ejecutamos 3 peticiones en paralelo
    forkJoin({
      reservas: this.reservaFacade.listarMisReservas(),
      servicios: this.servicioFacade.listar(),
      barberos: this.barberoFacade.listarBarberos()
    }).subscribe({
      next: (res) => {
        // 1. Llenar mapas de referencia
        const reservasSeguras = res.reservas || [];
        res.servicios.forEach(s => this.serviciosMap.set(s.id, s));
        res.barberos.forEach(b => this.barberoFacade.listarBarberos()); 
        // Nota: Si 'listarBarberos' devuelve BarberoResponseDTO[], mapeamos aquí:
        res.barberos.forEach(b => this.barberosMap.set(b.id, b));

        // 2. Mapear las reservas usando los mapas
        this.bookings = reservasSeguras.map(r => {
          const serv = this.serviciosMap.get(r.idServicio);
          const barb = this.barberosMap.get(r.idBarbero); 

          // Convertir fecha String ISO a Date
          const fechaInicio = new Date(r.horaInicio);
          const fechaFin = new Date(r.horaFin);

          return {
            id: r.idReserva,
            serviceName: serv ? serv.nombre : 'Servicio Desconocido',
            barberName: barb ? barb.nombre : 'Barbero no disponible',
            date: fechaInicio,
            startTime: this.formatTime(fechaInicio),
            endTime: this.formatTime(fechaFin),
            status: r.estado,
            price: serv ? serv.precio : 0,
            duration: serv ? serv.duracionMinutos + ' Min' : 'N/A',
            serviceCode: 'SVC-' + r.idServicio,
            companyName: 'Barba Negra',
            expanded: false,
            idServicio: r.idServicio,
            idBarbero: r.idBarbero
          };
        });

        // Ordenar: Más recientes primero
        this.bookings.sort((a, b) => b.date.getTime() - a.date.getTime());
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando datos', err);
        this.loading = false;
      }
    });
  }

  // --- FILTRO ---
  get filteredBookings() {
    // 1. Filtro por buscador de texto
    let filtered = this.bookings.filter(b =>
      b.serviceName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      b.barberName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    filtered = filtered.filter(b => 
       b.date.getDate() === this.selectedDateObj.getDate() &&
       b.date.getMonth() === this.selectedDateObj.getMonth()
    );
    
    return filtered;
  }

  toggleExpand(id: number) {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) booking.expanded = !booking.expanded;
  }

  // --- MODAL Y ACCIONES ---
  
  openEditModal(booking: BookingUI) {
    // Mapeamos al formato simple que espera tu Modal Genérico
    this.selectedBookingForEdit = {
      id: booking.id,
      serviceName: booking.serviceName,
      date: booking.date,
      startTime: booking.startTime,
      idBarbero: booking.idBarbero, 
      idServicio: booking.idServicio
    };
    this.showEditModal = true;
  }

  handleBookingUpdate(event: any) {
    const { action, id, date, time } = event;

    if (action === 'cancel') {
      this.cancelarReserva(id);
    } 
    else if (action === 'reschedule') {
      this.reprogramarReserva(id, date, time);
    }
  }

  // --- LÓGICA CONECTADA AL BACKEND ---

  private esDemasiadoTarde(fechaCita: Date): boolean {
    const ahora = new Date();
    const limite = new Date(fechaCita.getTime() - (2 * 60 * 60 * 1000)); 
    return ahora > limite;
  }

  cancelarReserva(id: number) {
    const booking = this.bookings.find(b => b.id === id);
    if (booking && this.esDemasiadoTarde(booking.date)) { 
       Swal.fire({
         icon: 'warning',
         title: 'Demasiado tarde',
         text: 'Solo puedes cancelar con 2 horas de anticipación. Por favor contacta a la barbería.',
         confirmButtonColor: '#FFD700'
       });
       return;
    }

    // 2. Flujo normal
    Swal.fire({ title: 'Cancelando...', didOpen: () => Swal.showLoading() });

    this.reservaFacade.cancelar(id).subscribe({
      next: () => {
        this.cargarDatosCompletos(); 
        Swal.fire('Cancelada', 'La reserva ha sido cancelada.', 'success');
      },
      error: (err) => Swal.fire('Error', 'No se pudo cancelar.', 'error')
    });
  }

  reprogramarReserva(id: number, newDate: Date, newTimeStr: string) {

    const booking = this.bookings.find(b => b.id === id);
    if (booking && this.esDemasiadoTarde(booking.date)) {
       this.showEditModal = false; // Cerramos el modal si estaba abierto
       Swal.fire({
         icon: 'warning',
         title: 'Demasiado tarde',
         text: 'Solo puedes reprogramar con 2 horas de anticipación.',
         confirmButtonColor: '#FFD700'
       });
       return;
    }

    Swal.fire({ title: 'Reprogramando...', didOpen: () => Swal.showLoading() });

    // Buscar datos originales para mantener mismo barbero y servicio
    const original = this.bookings.find(b => b.id === id);
    if(!original) return;

    // Preparar DTO
    const fechaStr = newDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const hora24 = this.convertirHora24(newTimeStr);

    const peticion: ReservaDTOPeticion = {
      idBarbero: original.idBarbero,
      idServicio: original.idServicio,
      fecha: fechaStr,
      horaInicio: hora24,
      tokenPago: '' // No aplica pago
    };

    this.reservaFacade.reprogramar(id, peticion).subscribe({
      next: () => {
        this.cargarDatosCompletos(); // Recargar
        this.showEditModal = false; // Cerrar modal si no se cerró
        Swal.fire('Reprogramada', 'Tu cita ha sido movida con éxito.', 'success');
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Horario no disponible o conflicto de agenda.', 'error');
      }
    });
  }

  // --- UTILIDADES DE FORMATO ---

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  convertirHora24(hora12: string): string {
    const [time, modifier] = hora12.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
    return `${hours.padStart(2, '0')}:${minutes}:00`; 
  }

  // Mapeo de estados del Backend a clases CSS y Textos
  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDIENTE': return 'PENDIENTE';
      case 'CANCELADA': return 'CANCELADA';
      case 'REPROGRAMADA': return 'REPROGRAMADA';
      case 'EN_PROCESO': return 'EN_PROCESO';
      case 'NO_PRESENTADO': return 'NO_PRESENTADO';
      case 'COMPLETADA': return 'COMPLETADA';
      default: return status;
    }
  }

  // --- CALENDARIO VISUAL (SIN CAMBIOS LÓGICOS, SOLO UI) ---
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const daysInCount = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = [];
    for (let i = 1; i <= daysInCount; i++) this.daysInMonth.push(new Date(year, month, i));
  }
  changeMonth(delta: number) {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + delta, 1);
    this.generateCalendar();
  }
  selectDate(date: Date) {
    this.selectedDateObj = date;
    setTimeout(() => this.scrollToSelected(), 200);
  }
  isSelected(date: Date): boolean {
    return date.getDate() === this.selectedDateObj.getDate() && date.getMonth() === this.selectedDateObj.getMonth();
  }
  scrollDays(d: number) { if(this.daysStrip) this.daysStrip.nativeElement.scrollBy({ left: d * 200, behavior: 'smooth' }); }
  scrollToSelected() { document.getElementById('selected-day-notif')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }

  esEditable(status: string): boolean {
    // Solo se pueden editar reservas que aún están pendientes o confirmadas
    const estadosEditables = ['PENDIENTE', 'REPROGRAMADA'];
    return estadosEditables.includes(status);
  }

}