import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription, startWith } from 'rxjs';

import { BarberDashboardFacade } from '../../../../core/facade/Dashboard/BarberDashboardFacade';
import { BarberDashboardDTO } from '../../../../core/domain/models/DTOs/Dashboard/Barber/BarberDashboardDTO';

// Imports de Widgets
import { CardComponent } from '../../../atoms/card/card.component';
import { WelcomeCardComponent } from '../../../molecules/welcome-card/welcome-card.component';
import { EventsListComponent } from '../../../molecules/events-list/events-list.component';
import { CalendarWidgetComponent } from '../../../molecules/calendar-widget/calendar-widget.component';
import { ProgressWidgetComponent } from '../../../molecules/progress-widget/progress-widget.component';
import { BarberProfileWidgetComponent } from '../../../molecules/barber-profile-widget/barber-profile-widget.component';
import { FeedbackWidgetComponent } from '../../../molecules/feedback-widget/feedback-widget.component';

@Component({
  selector: 'app-barbero-home',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    WelcomeCardComponent,
    FeedbackWidgetComponent,
    CalendarWidgetComponent,
    ProgressWidgetComponent,
    BarberProfileWidgetComponent
  ],
  templateUrl: './barbero-home.component.html',
  styleUrl: './barbero-home.component.css'
})
export class BarberoHomeComponent implements OnInit, OnDestroy {
  
  private dashboardFacade = inject(BarberDashboardFacade);
  
  dashboard: BarberDashboardDTO | null = null;
  loading = true;
  pollingSub: Subscription | undefined;

  ngOnInit() {
    // Actualizar cada 30 segundos
    this.pollingSub = interval(30000).pipe(startWith(0)).subscribe(() => {
      this.cargarDatos(false);
    });
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  async cargarDatos(showSpinner = true) {
    if (showSpinner) this.loading = true;
    try {
      this.dashboard = await this.dashboardFacade.getBarberDashboard();
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  // Helpers visuales
  get progressStart() {
    return this.dashboard?.reservaActual ? new Date(this.dashboard.reservaActual.horaInicio) : null;
  }

  get progressDuration() {
    return this.dashboard?.reservaActual?.duracionMinutos || 0;
  }
}