import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barber-profile-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barber-profile-widget.component.html',
  styleUrls: ['./barber-profile-widget.component.css']
})
export class BarberProfileWidgetComponent {

  @Input() name = '';
  @Input() specialty = '';
  @Input() rating = 5;
  @Input() photo = 'assets/images/default-barber.png';
  @Input() status: 'atendiendo' | 'disponible' | 'ocupado' = 'disponible';

  @Input() variant: 'client' | 'barber' | 'admin' = 'admin';

  get statusLabel() {
    switch (this.status) {
      case 'atendiendo': return 'Atendiendo ahora';
      case 'disponible': return 'Disponible';
      case 'ocupado': return 'Ocupado';
      default: return '';
    }
  }
}
