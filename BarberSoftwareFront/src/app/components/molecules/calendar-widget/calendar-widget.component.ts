import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-widget.component.html',
  styleUrls: ['./calendar-widget.component.css']
})
export class CalendarWidgetComponent implements OnInit {

  currentDate: Date = new Date(); // Fecha que se está viendo (mes/año)
  selectedDate: Date | null = null; // Fecha seleccionada por el usuario
  view: 'days' | 'years' = 'days'; // Controla qué vista mostramos
  daysInMonth: (number | null)[] = []; // Array para renderizar los días
  yearsList: number[] = []; // Array para renderizar los años

  weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  slideDirection: 'left' | 'right' | null = null;


  ngOnInit() {
    this.generateCalendar();
    this.generateYears();
  }

  // --- LÓGICA DEL CALENDARIO (DÍAS) ---

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Primer día del mes (0 = Domingo, 1 = Lunes...)
    // Ajustamos para que Lunes sea 0 y Domingo 6
    let firstDayIndex = new Date(year, month, 1).getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Total días en el mes
    const totalDays = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];

    // Rellenar espacios vacíos al inicio
    for (let i = 0; i < firstDayIndex; i++) {
      this.daysInMonth.push(null);
    }

    // Rellenar días
    for (let i = 1; i <= totalDays; i++) {
      this.daysInMonth.push(i);
    }
  }

  selectDay(day: number | null) {
    if (!day) return;
    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
  }

  changeMonth(delta: number) {
    this.slideDirection = delta > 0 ? 'right' : 'left';

    setTimeout(() => {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + delta,
        1
      );
      this.generateCalendar();
      this.slideDirection = null;
    }, 250);
  }

  isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear();
  }

  isSelected(day: number): boolean {
    if (!this.selectedDate) return false;
    return day === this.selectedDate.getDate() &&
      this.currentDate.getMonth() === this.selectedDate.getMonth() &&
      this.currentDate.getFullYear() === this.selectedDate.getFullYear();
  }

  // --- LÓGICA DE AÑOS ---

  generateYears() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10; // 10 años atrás
    const endYear = currentYear + 10;   // 10 años adelante
    this.yearsList = [];
    for (let i = startYear; i <= endYear; i++) {
      this.yearsList.push(i);
    }
  }

  toggleView() {
    this.view = this.view === 'days' ? 'years' : 'days';
  }

  selectYear(year: number) {
    this.currentDate = new Date(year, this.currentDate.getMonth(), 1);
    this.generateCalendar(); // Regenerar días para el nuevo año
    this.view = 'days'; // Volver a la vista de días
  }
}