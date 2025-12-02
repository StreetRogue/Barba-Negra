import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardFacade } from '../../../../core/facade/Dashboard/AdminDashboardFacade'; 
import { AdminDashboardDTO } from '../../../../core/domain/models/DTOs/Dashboard/Admin/AdminDashboardDTO';

import { WelcomeCardComponent } from '../../../molecules/welcome-card/welcome-card.component';
import { CalendarWidgetComponent } from '../../../molecules/calendar-widget/calendar-widget.component';
import { BarberProfileWidgetComponent } from '../../../molecules/barber-profile-widget/barber-profile-widget.component';
import { ProgressWidgetComponent } from '../../../molecules/progress-widget/progress-widget.component';
import { StatsWidgetComponent } from '../../../molecules/stats-widget/stats-widget.component';
import { EventsListComponent } from '../../../molecules/events-list/events-list.component';
import { CardComponent } from '../../../atoms/card/card.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    WelcomeCardComponent,
    CalendarWidgetComponent,
    BarberProfileWidgetComponent,
    ProgressWidgetComponent,
    StatsWidgetComponent,
    EventsListComponent,
    CardComponent
  ],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  private dashboardFacade = inject(AdminDashboardFacade);

  // Usamos el DTO tipado, inicializamos undefined para manejar el *ngIf en el HTML si es necesario
  dashboard: AdminDashboardDTO | undefined;

  loading = true;
  error = false;

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.loading = true;

    this.dashboardFacade.getDashboardAdmin()
      .then(data => {
        this.dashboard = data;
        this.loading = false;
        // Opcional: Console log para verificar que llegan las reservas pendientes
        console.log('Reservas Futuras (Pendientes):', data.reservasFuturas);
      })
      .catch(err => {
        console.error('❌ Error cargando dashboard:', err);
        this.error = true;
        this.loading = false;
      });
  }

  get progressStartTime() {
    if (!this.dashboard?.reservaActual) return null;
    return new Date(this.dashboard.reservaActual.horaInicio);
  }

  get progressDuration() {
    if (!this.dashboard?.reservaActual) return 0;

    const inicio = new Date(this.dashboard.reservaActual.horaInicio).getTime();
    const fin = new Date(this.dashboard.reservaActual.horaFin).getTime();
    const duracion = (fin - inicio) / 60000;
    
    return duracion > 0 ? duracion : 30; // Fallback a 30 min si el cálculo falla
  }
}