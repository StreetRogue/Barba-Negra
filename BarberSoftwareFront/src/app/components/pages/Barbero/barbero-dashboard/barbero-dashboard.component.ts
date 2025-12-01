import { Component, inject, signal } from '@angular/core';
import { SidebarComponent } from '../../../organisms/sidebar/sidebar.component';
import { TopbarComponent } from '../../../organisms/topbar/topbar.component';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from '../../../../core/facade/AuthFacade';

@Component({
  selector: 'app-barbero-dashboard',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, RouterOutlet],
  templateUrl: './barbero-dashboard.component.html',
  styleUrl: './barbero-dashboard.component.css'
})
export class BarberoDashboardComponent {
  private authFacade = inject(AuthFacade);
  user = this.authFacade.usuarioBackend;

  handleLogout(): void {
    this.authFacade.logout();
  }

  // Signal o variable normal para el estado del sidebar en móvil
  isMobileSidebarOpen = signal(false);

  toggleSidebar() {
    this.isMobileSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isMobileSidebarOpen.set(false);
  }
}
