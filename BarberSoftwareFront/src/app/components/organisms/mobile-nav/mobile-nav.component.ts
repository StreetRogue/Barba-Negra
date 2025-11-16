import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, Event as RouterEvent, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.css'
})
export class MobileNavComponent {

  // Método para el popup "En Construcción"
  showEnConstruccion(): void {
    Swal.fire({
      title: '¡Próximamente!',
      text: 'La agenda de citas estará disponible muy pronto.',
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: 'var(--c-primary-barber, #8a2c3b)' // Usamos el color de nuestra marca
    });
  }
}

