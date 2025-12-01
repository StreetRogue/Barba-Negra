import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { ReservaFacade } from '../../../../core/facade/ReservaFacade';
import { ServicioFacade } from '../../../../core/facade/ServicioFacade';
import { AuthFacade } from '../../../../core/facade/AuthFacade';

interface BookingUI {
  id: number;
  serviceName: string;
  barberName: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
  duration: string;
  serviceCode: string;
  expanded?: boolean;
  idServicio: number;
  idBarbero: number;
}

@Component({
  selector: 'app-barber-notification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barber-notification.component.html',
  styleUrls: ['./barber-notification.component.css']
})
export class BarberNotificationComponent implements OnInit {

  @ViewChild('daysStrip') daysStrip!: ElementRef;

  bookings: BookingUI[] = [];
  loading = true;

  private serviciosMap = new Map<number, any>();

  // Calendario
  currentDate: Date = new Date();
  selectedDateObj: Date = new Date();
  daysInMonth: Date[] = [];
  weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  searchTerm: string = '';

  constructor(
    private reservaFacade: ReservaFacade,
    private servicioFacade: ServicioFacade,
    private authFacade: AuthFacade
  ) { }

  ngOnInit() {
    this.generateCalendar();
    this.cargarDatos();
    setTimeout(() => this.scrollToSelected(), 150);
  }

  refreshData() {
    this.cargarDatos();
  }

  // ======================================
  // CARGA DE RESERVAS
  // ======================================
  cargarDatos() {
    this.loading = true;

    this.reservaFacade.listarReservasPorBarbero().subscribe({
      next: reservas => {
        this.servicioFacade.listar().subscribe(servicios => {
          servicios.forEach(s => this.serviciosMap.set(s.id, s));

          this.bookings = reservas.map(r => {
            const serv = this.serviciosMap.get(r.idServicio);
            const inicio = new Date(r.horaInicio);
            const fin = new Date(r.horaFin);

            return {
              id: r.idReserva,
              serviceName: serv?.nombre ?? 'Servicio',
              barberName: this.authFacade.usuarioBackend()?.nombre ?? '',
              date: inicio,
              startTime: this.formatTime(inicio),
              endTime: this.formatTime(fin),
              status: r.estado,
              price: serv?.precio ?? 0,
              duration: serv?.duracionMinutos + ' Min',
              serviceCode: `SVC-${r.idServicio}`,
              expanded: false,
              idServicio: r.idServicio,
              idBarbero: r.idBarbero
            };
          });

          this.bookings.sort((a, b) => b.date.getTime() - a.date.getTime());
          this.loading = false;
        });
      },
      error: () => this.loading = false
    });
  }

  // ======================================
  // VALIDACIONES DE NEGOCIO
  // ======================================
  puedeIniciar(booking: BookingUI): boolean {
    return booking.status === 'PENDIENTE' || booking.status === 'REPROGRAMADA';
  }

  puedeMarcarNoPresentado(booking: BookingUI): boolean {
    return booking.status === 'PENDIENTE' || booking.status === 'REPROGRAMADA';
  }

  puedeCompletar(booking: BookingUI): boolean {
    return booking.status === 'EN_PROCESO';
  }

  // ======================================
  // ACCIONES DEL BARBERO
  // ======================================

  iniciarReserva(id: number) {
    // 1. Buscamos la reserva en memoria
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) return;

    const ahora = new Date();
    const fechaInicio = new Date(booking.date);
    const margenMinutos = 0;
    const fechaConMargen = new Date(fechaInicio.getTime() - (margenMinutos * 60000));

    // 3. Validamos si es muy temprano
    if (ahora < fechaConMargen) {
      // Calculamos cuánto falta para mostrar un mensaje amigable
      const diferenciaMs = fechaInicio.getTime() - ahora.getTime();
      const minutosFaltantes = Math.ceil(diferenciaMs / 60000);

      Swal.fire(
        'Aún es temprano',
        `No puedes iniciar la reserva todavía. Faltan ${minutosFaltantes} minutos para la hora agendada (${booking.startTime}).`,
        'warning'
      );
      return;
    }

    // 4. Si pasa la validación, procedemos con la lógica original
    Swal.fire({ title: 'Iniciando...', didOpen: () => Swal.showLoading() });

    this.reservaFacade.iniciar(id).subscribe({
      next: resp => {
        this.actualizarEstadoLocal(id, resp.estado);
        Swal.fire('Iniciado', 'Has iniciado el servicio.', 'success');
      },
      error: () => Swal.fire('Error', 'No se pudo iniciar.', 'error')
    });
  }

  completarReserva(id: number) {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) return;

    // VALIDACIÓN DE HORA FINAL (Lógica mejorada)
    const ahora = new Date();
    
    // Construimos la fecha fin exacta usando la fecha de la reserva y la hora fin string
    const fechaFin = new Date(booking.date); 
    const [h, m] = booking.endTime.split(':');
    fechaFin.setHours(Number(h), Number(m), 0);

    // Si ahora es ANTES de la hora de fin, mostramos alerta y detenemos.
    if (ahora < fechaFin) {
      // Calculamos cuánto falta
      const diffMs = fechaFin.getTime() - ahora.getTime();
      const minutosFaltantes = Math.ceil(diffMs / 60000);

      Swal.fire({
        icon: 'warning',
        title: 'Aún no termina',
        html: `El servicio está programado para terminar a las <b>${booking.endTime}</b>.<br>Faltan ${minutosFaltantes} minutos.`,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#FFD700'
      });
      return; 
    }

    // FLUJO NORMAL SI PASA LA VALIDACIÓN
    Swal.fire({ title: 'Completando...', didOpen: () => Swal.showLoading() });

    this.reservaFacade.completar(id).subscribe({
      next: resp => {
        this.actualizarEstadoLocal(id, resp.estado);
        Swal.fire('Completado', 'El servicio ha finalizado.', 'success');
      },
      error: () => Swal.fire('Error', 'No se pudo completar.', 'error')
    });
  }

  marcarNoPresentado(id: number) {
    // 1. Buscar la reserva
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) return;

    // 2. Calcular tiempos
    const ahora = new Date();
    const fechaInicio = new Date(booking.date);
    const minutosEspera = 10;

    // Calculamos la hora a la que se habilita el botón (Inicio + 10 min)
    const horaHabilitada = new Date(fechaInicio.getTime() + (minutosEspera * 60000));

    // 3. Validación: Si "ahora" es antes de "horaHabilitada", bloqueamos.
    if (ahora < horaHabilitada) {
      const minutosFaltantes = Math.ceil((horaHabilitada.getTime() - ahora.getTime()) / 60000);

      Swal.fire(
        'Espera un momento',
        `Solo puedes marcar "No presentado" pasados ${minutosEspera} minutos del inicio de la cita.\n\nPodrás hacerlo en ${minutosFaltantes} minutos.`,
        'warning'
      );
      return; // ⛔ DETENEMOS AQUÍ
    }

    // 4. Si pasa la validación, mostramos la confirmación original
    Swal.fire({
      title: '¿El cliente no llegó?',
      text: "Se marcará la reserva como No Presentado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Rojo para indicar acción negativa
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar'
    }).then(r => {
      if (!r.isConfirmed) return;

      this.reservaFacade.marcarNoPresentado(id).subscribe({
        next: resp => {
          this.actualizarEstadoLocal(id, resp.estado);
          Swal.fire('Marcado', 'La reserva se ha actualizado.', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar la reserva.', 'error')
      });
    });
  }

  actualizarEstadoLocal(id: number, estado: string) {
    const i = this.bookings.findIndex(b => b.id === id);
    if (i !== -1) {
      this.bookings[i].status = estado;
      this.bookings[i].expanded = false;
    }
  }

  // ======================================
  // FILTROS
  // ======================================
  get filteredBookings() {
    return this.bookings.filter(
      b =>
        b.serviceName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        b.startTime.includes(this.searchTerm) ||
        b.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        b.serviceCode.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleExpand(id: number) {
    const b = this.bookings.find(x => x.id === id);
    if (b) b.expanded = !b.expanded;
  }

  // ======================================
  // UTILIDADES
  // ======================================
  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'REPROGRAMADA': return 'Reprogramada';
      case 'EN_PROCESO': return 'En proceso';
      case 'COMPLETADA': return 'Completado';
      case 'CANCELADA': return 'Cancelado';
      case 'NO_PRESENTADO': return 'No presentado';
      default: return status;
    }
  }

  // ======================================
  // CALENDARIO
  // ======================================
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];
    for (let d = 1; d <= totalDays; d++) {
      this.daysInMonth.push(new Date(year, month, d));
    }
  }

  changeMonth(delta: number) {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + delta,
      1
    );
    this.generateCalendar();
  }

  selectDate(date: Date) {
    this.selectedDateObj = date;
    setTimeout(() => this.scrollToSelected(), 200);
  }

  isSelected(date: Date) {
    return (
      date.getDate() === this.selectedDateObj.getDate() &&
      date.getMonth() === this.selectedDateObj.getMonth()
    );
  }

  scrollDays(delta: number) {
    if (this.daysStrip)
      this.daysStrip.nativeElement.scrollBy({
        left: delta * 200,
        behavior: 'smooth'
      });
  }

  scrollToSelected() {
    document
      .getElementById('selected-day-notif')
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }
}
