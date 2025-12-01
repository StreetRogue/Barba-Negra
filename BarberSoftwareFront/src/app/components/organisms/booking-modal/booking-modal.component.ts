import { Component, Input, Output, EventEmitter, OnInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// ARQUITECTURA
import { BarberoFacade } from '../../../core/facade/BarberoFacade';
import { AgendaFacade } from '../../../core/facade/AgendaFacade';
import { ReservaFacade } from '../../../core/facade/ReservaFacade';

import { BarberoServicioRespuestaDTO } from '../../../core/domain/models/DTOs/BarberoServicio/BarberoServicioRespuestaDTO';
import { ReservaDTOPeticion } from '../../../core/domain/models/DTOs/Reserva/ReservaDTOPeticion';


@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.css'
})
export class BookingModalComponent implements OnInit, OnChanges {

  @Input() isVisible = false;
  @Input() serviceData: any = null;
  @Output() close = new EventEmitter<void>();
  @ViewChild('daysStrip') daysStrip!: ElementRef;

  currentStep = 1;
  isProcessing = false;

  servicioDisplay: any = {
    nombre: '',
    precio: 0,
    duracion: 0,
    descripcion: ''
  };

  // --- PASO 2: BARBEROS ---
  barbersFromBack: BarberoServicioRespuestaDTO[] = [];
  currentBarberIndex = 0;
  selectedBarber: BarberoServicioRespuestaDTO | null = null;
  loadingBarbers = false;
  availableAvatars = ['assets/images/avatar.png', 'assets/images/avatar.png', 'assets/images/avatar.png'];

  // --- PASO 3: CALENDARIO ---
  currentDate: Date = new Date();
  selectedDateObj: Date | null = null;
  selectedTime: string = '';
  daysInMonth: Date[] = [];
  weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  morningSlots: string[] = [];
  afternoonSlots: string[] = [];
  loadingSlots = false;

  // --- PASO 4: PAGO ---
  selectedPaymentMethod: 'cash' | 'card' | 'paypal' = 'card';
  showAddCardForm = false;
  newCard = { number: '', holder: '', expiry: '', cvc: '' };
  savedCard: any = null; // Aquí guardamos la tarjeta validada
  cardErrors = { number: false, holder: false, expiry: false, cvc: false };

  constructor(
    private barberoFacade: BarberoFacade,
    private agendaFacade: AgendaFacade,
    private reservaFacade: ReservaFacade
  ) { }

  ngOnInit() {
    this.generateCalendar();
    // Inicialización por defecto
    this.selectDate(new Date());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['serviceData'] && this.serviceData) {
      
      // 1. NORMALIZACIÓN DE DATOS (Mapeo Inglés -> Español)
      this.servicioDisplay = {
        // La consola dice 'name', el DTO dice 'nombre'. Soportamos ambos.
        nombre: this.serviceData.name || this.serviceData.nombre || 'Servicio',
        
        // La consola dice 'description', el DTO 'descripcion'
        descripcion: this.serviceData.description || this.serviceData.descripcion || 'Sin descripción.',

        // La consola dice 'duration', el DTO 'duracionMinutos'
        duracion: this.serviceData.duration || this.serviceData.duracionMinutos || 0,
        
        // La consola dice 'price' ("$ 15.000 COP"), el DTO 'precio' (15000)
        precio: this.limpiarPrecio(this.serviceData.price || this.serviceData.precio)
      };

      // 2. Si tenemos ID, cargamos barberos
      if (this.serviceData.id) {
         this.cargarBarberosDelServicio();
      }
    }

    // CORRECCIÓN: Detectar cuando se abre el modal para resetear al día actual
    if (changes['isVisible'] && this.isVisible) {
      // Reiniciamos al día de hoy para que el scroll funcione correctamente al abrir
      setTimeout(() => {
        this.currentDate = new Date();
        this.generateCalendar();
        this.selectDate(new Date());
      }, 100); // Pequeño delay para asegurar que el DOM del modal ya existe
    }
  }

  // ==========================================
  // LÓGICA DE SIMULACIÓN STRIPE (SANDBOX)
  // ==========================================
  private getStripeToken(): string {
    if (this.selectedPaymentMethod === 'cash') return 'PAGO_EN_EFECTIVO';
    if (this.selectedPaymentMethod === 'paypal') return 'tok_paypal_mock';

    if (this.savedCard && this.savedCard.number.startsWith('4242')) {
      return 'pm_card_visa'; // Token válido de prueba
    }
    return 'pm_card_visa_chargeDeclined';
  }


  finalizeBooking() {
    if (this.selectedPaymentMethod === 'card' && !this.savedCard) {
      Swal.fire({ icon: 'warning', title: 'Falta método de pago', text: 'Agrega una tarjeta.', confirmButtonColor: '#FFC107' });
      return;
    }

    if (this.isProcessing) return;
    this.isProcessing = true;
    const fechaFormat = this.selectedDateObj!.toISOString().split('T')[0];
    const hora24 = this.convertirHora24(this.selectedTime);
    const reservaDTO: ReservaDTOPeticion = {
      idBarbero: this.selectedBarber!.barberoId,
      idServicio: this.serviceData.id,
      fecha: fechaFormat,
      horaInicio: hora24,
      tokenPago: this.getStripeToken()
    };

    Swal.fire({
      title: 'Procesando reserva...',
      text: 'Estamos confirmando tu cita',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      background: '#333', color: '#fff'
    });
    this.reservaFacade.crear(reservaDTO).subscribe({
      next: (res) => {
        this.isProcessing = false;
        const dateStr = this.selectedDateObj?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

        Swal.fire({
          title: '<span style="color:#FFC107">¡Reserva Exitosa!</span>',
          html: `
                  <div style="text-align: center; color: #ddd;">
                    <p>Tu código de reserva es: <strong>#${res.idReserva}</strong></p>
                    <p>Te esperamos el <strong>${dateStr}</strong> a las <strong>${this.selectedTime}</strong></p>
                  </div>
                `,
          icon: 'success',
          background: '#2a2a2a', color: '#fff',
          confirmButtonText: 'Genial', confirmButtonColor: '#FFC107'
        }).then(() => this.closeModal());
      },
      error: (err) => {
        this.isProcessing = false;
        console.error(err);
        let msg = 'No se pudo completar la reserva.';
        if (err.error?.message === 'CONFLICT') msg = 'El horario seleccionado ya no está disponible.';

        Swal.fire({
          title: 'Error',
          text: msg,
          icon: 'error',
          background: '#333', color: '#fff',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
  convertirHora24(hora12: string): string {
    const [time, modifier] = hora12.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  }

  // --- MÉTODOS EXISTENTES (BARBEROS, CALENDARIO, UI) ---

  cargarBarberosDelServicio() {
    this.loadingBarbers = true;
    this.barberoFacade.listarBarberosPorServicio(this.serviceData.id).subscribe({
      next: (data) => { this.barbersFromBack = data; this.loadingBarbers = false; },
      error: () => this.loadingBarbers = false
    });
  }

  getBarberImage(index: number): string {
    return this.availableAvatars[index % this.availableAvatars.length];
  }

  nextBarber() { if (this.barbersFromBack.length > 0) this.currentBarberIndex = (this.currentBarberIndex < this.barbersFromBack.length - 1) ? this.currentBarberIndex + 1 : 0; }
  prevBarber() { if (this.barbersFromBack.length > 0) this.currentBarberIndex = (this.currentBarberIndex > 0) ? this.currentBarberIndex - 1 : this.barbersFromBack.length - 1; }

  // Calendario
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
    if (this.isPastDate(date)) {
      return;
    }
    this.selectedDateObj = date;
    this.selectedTime = '';
    // Aumentamos ligeramente el timeout para asegurar que el DOM esté listo
    setTimeout(() => this.scrollToSelected(), 100);
    if (this.selectedBarber) this.cargarSlotsDisponibles();
  }

  public isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    return target < today;
  }

  isSelected(date: Date): boolean {
    if (!this.selectedDateObj) return false;
    return date.getDate() === this.selectedDateObj.getDate() && date.getMonth() === this.selectedDateObj.getMonth();
  }
  scrollDays(d: number) { if (this.daysStrip) this.daysStrip.nativeElement.scrollBy({ left: d * 200, behavior: 'smooth' }); }
  scrollToSelected() {
    const el = document.getElementById('selected-day-card');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  private esHoraPasada(hora24: string): boolean {
    if (!this.selectedDateObj) return false;

    const hoy = new Date();
    const seleccionada = new Date(this.selectedDateObj);

    if (seleccionada.toDateString() !== hoy.toDateString()) {
      return false;
    }

    const [horasSlot, minutosSlot] = hora24.split(':').map(Number);

    const horasActual = hoy.getHours();
    const minutosActual = hoy.getMinutes();

    if (horasSlot < horasActual) return true;
    if (horasSlot === horasActual && minutosSlot <= minutosActual) return true;

    return false;
  }
  cargarSlotsDisponibles() {
    if (!this.selectedDateObj || !this.selectedBarber) return;

    this.loadingSlots = true;
    this.morningSlots = [];
    this.afternoonSlots = [];

    const fechaStr = this.selectedDateObj.toISOString().split('T')[0];

    this.agendaFacade.obtenerSlots(this.selectedBarber.barberoId, this.serviceData.id, fechaStr).subscribe({
      next: (slots) => {
        const disponibles = slots.filter(s => s.disponible);

        disponibles.forEach(s => {
          if (this.esHoraPasada(s.horaInicio)) {
            return; // "continue" en el forEach, salta este slot
          }

          // 2. Procesamiento normal
          const h = parseInt(s.horaInicio.split(':')[0]);
          const f = this.convertirHora12(s.horaInicio);

          if (h < 12) {
            this.morningSlots.push(f);
          } else {
            this.afternoonSlots.push(f);
          }
        });

        this.loadingSlots = false;
      },
      error: () => this.loadingSlots = false
    });
  }
  convertirHora12(h24: string): string {
    const [h, m] = h24.split(':');
    let hr = parseInt(h);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    hr = hr % 12; hr = hr ? hr : 12;
    return `${hr}:${m} ${ampm}`;
  }
  selectTime(t: string) { this.selectedTime = t; }

  // Pago UI
  formatCardNumber(e: any) {
    let input = e.target.value.replace(/\D/g, '').substring(0, 16);
    input = input != '' ? input.match(/.{1,4}/g)?.join(' ') : '';
    this.newCard.number = input;
  }
  formatExpiry(e: any) {
    let input = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (input.length >= 3) input = input.substring(0, 2) + '/' + input.substring(2, 4);
    this.newCard.expiry = input;
  }
  formatCvc(e: any) { this.newCard.cvc = e.target.value.replace(/\D/g, '').substring(0, 4); }

  validateAndSaveCard() {
    // Validación básica visual
    if (this.newCard.number.length < 16) {
      // feedback error...
      return;
    }
    this.savedCard = { ...this.newCard, last4: this.newCard.number.replace(/\s/g, '').slice(-4) };
    this.showAddCardForm = false;
    Swal.fire({ icon: 'success', title: 'Tarjeta guardada', toast: true, position: 'top-end', timer: 2000, background: '#333', color: '#fff', showConfirmButton: false });
  }
  selectPayment(m: any) { this.selectedPaymentMethod = m; this.showAddCardForm = false; }
  toggleAddCard() { this.showAddCardForm = true; }

  goToToday() {
    // 1. Reseteamos la fecha base al momento actual
    this.currentDate = new Date();
    
    // 2. Regeneramos el arreglo de días del mes actual
    this.generateCalendar();

    // 3. Seleccionamos el día de hoy
    // Nota: selectDate ya se encarga de llamar a scrollToSelected()
    this.selectDate(new Date());
  }

  // Navegación
  closeModal() { this.isVisible = false; this.currentStep = 1; this.close.emit(); }
  nextStep() {
    if (this.currentStep === 2 && !this.selectedBarber && this.barbersFromBack.length > 0) this.selectedBarber = this.barbersFromBack[this.currentBarberIndex];
    if (this.currentStep === 3 && (!this.selectedDateObj || !this.selectedTime)) { Swal.fire('Atención', 'Selecciona fecha y hora', 'warning'); return; }
    if (this.currentStep < 4) this.currentStep++; else this.finalizeBooking();
  }
  prevStep() {
    if (this.currentStep === 4 && this.showAddCardForm) { this.showAddCardForm = false; return; }
    if (this.currentStep > 1) this.currentStep--;
  }

  private limpiarPrecio(valor: any): number {
    if (typeof valor === 'number') return valor;
    if (!valor) return 0;
    
    // Convierte a string, quita todo lo que NO sea número (incluyendo puntos y espacios)
    const soloNumeros = valor.toString().replace(/[^0-9]/g, '');
    return Number(soloNumeros);
  }
}