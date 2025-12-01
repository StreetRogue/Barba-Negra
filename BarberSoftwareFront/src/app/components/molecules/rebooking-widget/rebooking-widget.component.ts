import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rebooking-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rebooking-widget.component.html',
  styleUrls: ['./rebooking-widget.component.css']
})
export class RebookingWidgetComponent implements OnInit {

  @Input() variant: 'client' | 'barber' | 'admin' = 'client';
  @Input() lastVisitDate: Date = new Date(); // Recibirás esto del backend
  @Input() lastService: string = 'Corte Clásico';
  @Input() barberName: string = 'Andrés';

  daysPassed: number = 0;
  statusMessage: string = '';
  urgencyLevel: 'low' | 'medium' | 'high' = 'low';

  ngOnInit() {
    this.calculateDays();
    this.setStatus();
  }

  calculateDays() {
    const oneDay = 24 * 60 * 60 * 1000; // horas*min*seg*milliseg
    const today = new Date();
    // Cálculo simple de diferencia de días
    this.daysPassed = Math.round(Math.abs((today.getTime() - this.lastVisitDate.getTime()) / oneDay));
  }

  setStatus() {
    if (this.daysPassed < 15) {
      this.statusMessage = 'Tu look sigue fresco';
      this.urgencyLevel = 'low';
    } else if (this.daysPassed < 25) {
      this.statusMessage = 'Es buen momento para retocar';
      this.urgencyLevel = 'medium';
    } else {
      this.statusMessage = '¡Tu cabello te necesita!';
      this.urgencyLevel = 'high';
    }
  }

  onRebook() {
    console.log('Navegar a reserva con pre-carga de:', this.lastService);
    // Aquí iría tu lógica de router.navigate(['/reservar'], ...)
  }
}