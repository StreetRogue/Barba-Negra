import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AuthFacade } from '../../../../core/facade/AuthFacade';
import { ClientDashboardFacade } from '../../../../core/facade/Dashboard/ClientDashboardFacade'; 
import { ClientDashboardDTO } from '../../../../core/domain/models/DTOs/Dashboard/Cliente/ClientDashboardDTO'; 
import { CardComponent } from '../../../atoms/card/card.component';
import { WelcomeCardComponent } from '../../../molecules/welcome-card/welcome-card.component';
import { CalendarWidgetComponent } from '../../../molecules/calendar-widget/calendar-widget.component';
import { ProgressWidgetComponent } from '../../../molecules/progress-widget/progress-widget.component';
import { BarberProfileWidgetComponent } from '../../../molecules/barber-profile-widget/barber-profile-widget.component';

import { RebookingWidgetComponent } from '../../../molecules/rebooking-widget/rebooking-widget.component';

@Component({
  selector: 'app-cliente-home',
  standalone: true,
  imports: [
    CommonModule, 
    CardComponent, 
    WelcomeCardComponent, 
    CalendarWidgetComponent,
    ProgressWidgetComponent, 
    BarberProfileWidgetComponent, 
    RebookingWidgetComponent
  ],
  templateUrl: './cliente-home.component.html',
  styleUrl: './cliente-home.component.css'
})
export class ClienteHomeComponent implements OnInit {
  
  private authFacade = inject(AuthFacade);
  private dashboardFacade = inject(ClientDashboardFacade);

  user = this.authFacade.usuarioBackend;
  
  // Estado del Dashboard
  dashboard: ClientDashboardDTO | null = null;
  loading = true;

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.loading = true;
    this.dashboardFacade.getClientDashboard()
      .then(data => {
        this.dashboard = data;
        this.loading = false;
      })
      .catch(err => {
        console.error(err);
        this.loading = false;
      });
  }

  getPorcentajeFidelidad(): number {
    const total = this.dashboard?.stats?.totalCortes || 0;
    const modulo = total % 5; 
    return (modulo / 5) * 100;
  }

  getCortesParaPremio(): number {
    const total = this.dashboard?.stats?.totalCortes || 0;
    const faltantes = 5 - (total % 5);
    return faltantes === 5 ? 0 : faltantes; // Si es 0 es que justo reclamó
  }

  getNivelCliente(): string {
    const total = this.dashboard?.stats?.totalCortes || 0;
    if (total < 5) return 'Bronce';
    if (total < 15) return 'Plata';
    return 'Oro';
  }

  // Helpers para el HTML (Evitan lógica compleja en el template)
  get progressStart() {
    return this.dashboard?.reservaActual ? new Date(this.dashboard.reservaActual.horaInicio) : null;
  }

  get progressDuration() {
    return this.dashboard?.reservaActual?.duracionMinutos || 0;
  }
}