import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-booking-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-booking-modal.component.html',
  styleUrl: './edit-booking-modal.component.css'
})
export class EditBookingModalComponent implements OnInit {

  @Input() isVisible = false;
  @Input() booking: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() bookingUpdated = new EventEmitter<any>();

  @ViewChild('daysStrip') daysStrip!: ElementRef;

  currentView: 'options' | 'reschedule' = 'options';

  currentDate: Date = new Date();
  newSelectedDate: Date | null = null;
  newSelectedTime: string = '';
  
  daysInMonth: Date[] = [];
  weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  morningSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'];
  afternoonSlots = ['02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

  ngOnInit() {
    this.generateCalendar();
  }

  // --- ACCIÓN: CANCELAR ---
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
        
        // 1. Emitir y cerrar primero
        this.bookingUpdated.emit({ action: 'cancel', id: this.booking.id });
        this.closeModal();
        
        // 2. Mostrar éxito con pequeño delay para asegurar que el modal se cerró
        setTimeout(() => {
            Swal.fire({
              title: 'Cancelada',
              text: 'Tu cita ha sido cancelada exitosamente.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              background: '#222',
              color: '#fff'
            });
        }, 300);
      }
    });
  }

  // --- ACCIÓN: REPROGRAMAR ---
  startReschedule() {
    this.currentView = 'reschedule';
    this.currentDate = new Date(); 
    this.generateCalendar();
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
        
        // 1. Emitir y cerrar
        this.bookingUpdated.emit({ 
          action: 'reschedule', 
          id: this.booking.id,
          date: this.newSelectedDate,
          time: this.newSelectedTime
        });
        this.closeModal();

        // 2. Feedback con delay
        setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: '¡Reprogramado!',
              text: 'Tu cita se ha actualizado correctamente.',
              background: '#222',
              color: '#fff',
              timer: 2000,
              showConfirmButton: false
            });
        }, 300);
      }
    });
  }

  // --- LÓGICA CALENDARIO ---
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

  selectDate(date: Date) {
    this.newSelectedDate = date;
    this.newSelectedTime = '';
    setTimeout(() => this.scrollToSelected(), 100);
  }

  selectTime(time: string) {
    this.newSelectedTime = time;
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

  // --- NAVEGACIÓN ---
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