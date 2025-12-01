import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  @Input() variant: 'client' | 'admin' | 'barber' = 'client';

  // Datos que vienen del Dashboard (AuthFacade)
  @Input() userName: string | undefined | null = 'Usuario';
  @Input() userImage: string | undefined | null = null;

  // Evento para cerrar sesión
  @Output() logoutAction = new EventEmitter<void>();
  @Output() toggleMenu = new EventEmitter<void>();

  // Imagen por defecto (si Google falla o no tiene foto)
  defaultImage = 'assets/images/avatar.png';

  onSearch(query: string) {
    console.log('Búsqueda realizada:', query);
  }

  // Si la imagen de Google da error 404, ponemos la default
  handleImageError(event: any) {
    event.target.src = this.defaultImage;
  }
}