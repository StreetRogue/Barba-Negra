import { Component, signal } from "@angular/core";
import { SidebarComponent } from "../../../organisms/sidebar/sidebar.component";
import { AuthFacade } from '../../../../core/facade/AuthFacade';
import { inject } from '@angular/core';
import { TopbarComponent } from "../../../organisms/topbar/topbar.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, RouterOutlet],
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.css']
})
export class ClienteDashboardComponent {
  private authFacade = inject(AuthFacade);
  user = this.authFacade.usuarioBackend;

  // Signal o variable normal para el estado del sidebar en móvil
  isMobileSidebarOpen = signal(false);

  toggleSidebar() {
    this.isMobileSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isMobileSidebarOpen.set(false);
  }

  handleLogout(): void {
    this.authFacade.logout();
  }
}