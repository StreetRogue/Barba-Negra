import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

// 1. IMPORTAR LA FACHADA
import { AgendaFacade } from '../../../core/facade/AgendaFacade';

@Component({
  selector: 'app-edit-booking-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-booking-modal.component.html',
  styleUrl: './edit-booking-modal.component.css'
})
export class EditBookingModalComponent implements OnInit {

  @Input() isVisible = false;
  @Input() booking: any = null; // Debe traer { idBarbero, idServicio, ... }
  @Output() close = new EventEmitter<void>();
  @Output() bookingUpdated = new EventEmitter<any>();

  @ViewChild('daysStrip') daysStrip!: ElementRef;

  // 2. INYECCIÓN DE DEPENDENCIA
  private agendaFacade = inject(AgendaFacade);

  currentView: 'options' | 'reschedule' = 'options';
  currentDate: Date = new Date();
  newSelectedDate: Date | null = null;
  newSelectedTime: string = '';
  
  daysInMonth: Date[] = [];
  weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  // 3. ARRAYS DINÁMICOS (Se llenan desde el backend)
  morningSlots: string[] = [];
  afternoonSlots: string[] = [];
  
  loadingSlots = false;

  ngOnInit() {
    this.generateCalendar();
  }

  // ==================================================
  // 4. LÓGICA PARA CARGAR HORARIOS REALES DEL BACKEND
  // ==================================================
  cargarSlotsDisponibles() {
    // Validamos que tengamos fecha, barbero y servicio antes de llamar
    if (!this.newSelectedDate || !this.booking?.idBarbero || !this.booking?.idServicio) return;

    this.loadingSlots = true;
    this.morningSlots = [];
    this.afternoonSlots = [];
    
    // Formato YYYY-MM-DD para el backend
    const fechaStr = this.newSelectedDate.toISOString().split('T')[0];

    this.agendaFacade.obtenerSlots(this.booking.idBarbero, this.booking.idServicio, fechaStr).subscribe({
      next: (slots) => {
        // Filtramos solo los disponibles
        const disponibles = slots.filter(s => s.disponible);

        disponibles.forEach(s => {
          // Validamos si la hora ya pasó (si es hoy)
          if (this.esHoraPasada(s.horaInicio)) return;

          const h = parseInt(s.horaInicio.split(':')[0]);
          const f = this.convertirHora12(s.horaInicio);

          if (h < 12) this.morningSlots.push(f);
          else this.afternoonSlots.push(f);
        });

        this.loadingSlots = false;
      },
      error: (err) => {
        console.error('Error cargando slots', err);
        this.loadingSlots = false;
      }
    });
  }

  // --- HELPERS DE HORA ---

  // Valida si una hora ya pasó hoy
  private esHoraPasada(hora24: string): boolean {
    if (!this.newSelectedDate) return false;
    const hoy = new Date();
    const seleccionada = new Date(this.newSelectedDate);

    // Si no es hoy, no filtramos nada
    if (seleccionada.toDateString() !== hoy.toDateString()) return false;

    const [horasSlot, minutosSlot] = hora24.split(':').map(Number);
    const horasActual = hoy.getHours();
    const minutosActual = hoy.getMinutes();

    if (horasSlot < horasActual) return true;
    if (horasSlot === horasActual && minutosSlot <= minutosActual) return true;

    return false;
  }

  // Convierte "14:00:00" a "02:00 PM"
  convertirHora12(h24: string): string {
    const [h, m] = h24.split(':');
    let hr = parseInt(h);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    hr = hr % 12; 
    hr = hr ? hr : 12;
    return `${hr}:${m} ${ampm}`;
  }

  // ==================================================

  // --- ACCIÓN: REPROGRAMAR ---
  startReschedule() {
    this.currentView = 'reschedule';
    this.currentDate = new Date(); 
    this.generateCalendar();
    
    // Seleccionamos hoy por defecto y cargamos slots
    this.selectDate(new Date()); 
  }

  confirmReschedule() {
    if (!this.newSelectedDate || !this.newSelectedTime) return;

    Swal.fire({
      title: '¿Confirmar cambio?',
      html: `
        <div style="text-align: center; color: #ccc;">
          <p>Mover cita al:</p>
          <h3 style="color: #FFC107;">${this.newSelectedDate.toLocaleDateString()} - ${this.newSelectedTime}</h3>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      background: '#222',
      color: '#fff',
      confirmButtonColor: '#FFC107',
      cancelButtonColor: '#555',
      confirmButtonText: '<span style="color:#000; font-weight:bold">Confirmar</span>',
      cancelButtonText: 'Revisar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookingUpdated.emit({ 
          action: 'reschedule', 
          id: this.booking.id, 
          date: this.newSelectedDate, 
          time: this.newSelectedTime 
        });
        this.closeModal();
      }
    });
  }
  
  confirmCancellation() {
    Swal.fire({
      title: '¿Cancelar Cita?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      background: '#222',
      color: '#fff',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#555',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookingUpdated.emit({ action: 'cancel', id: this.booking.id });
        this.closeModal();
      }
    });
  }


  // --- CALENDARIO ---
  selectDate(date: Date) {
    // Validar fecha pasada (para no dejar seleccionar ayer)
    if (this.isPastDate(date)) return;

    this.newSelectedDate = date;
    this.newSelectedTime = '';
    
    // 5. IMPORTANTE: LLAMAR A CARGAR SLOTS AL ELEGIR FECHA
    this.cargarSlotsDisponibles();

    setTimeout(() => this.scrollToSelected(), 100);
  }

  selectTime(time: string) {
    this.newSelectedTime = time;
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const daysInCount = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = [];
    for (let i = 1; i <= daysInCount; i++) {
      this.daysInMonth.push(new Date(year, month, i));
    }
  }

  changeMonth(delta: number) {
    const newDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + delta, 1);
    this.currentDate = newDate;
    this.generateCalendar();
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return target < today;
  }

  isSelected(date: Date): boolean {
    if (!this.newSelectedDate) return false;
    return date.getDate() === this.newSelectedDate.getDate() &&
           date.getMonth() === this.newSelectedDate.getMonth();
  }

  scrollDays(direction: number) {
    this.daysStrip.nativeElement.scrollBy({ left: direction * 200, behavior: 'smooth' });
  }

  scrollToSelected() {
    const el = document.getElementById('selected-day-edit');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  closeModal() {
    this.isVisible = false;
    setTimeout(() => {
      this.currentView = 'options';
      this.newSelectedDate = null;
      this.newSelectedTime = '';
    }, 300);
    this.close.emit();
  }
  
  goBack() {
    this.currentView = 'options';
  }
}