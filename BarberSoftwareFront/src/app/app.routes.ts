import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginPageComponent } from './components/pages/login/login.component';
import { ClienteDashboardComponent } from './components/pages/Cliente/cliente-dashboard/cliente-dashboard.component'; 
import { AdminDashboardComponent } from './components/pages/Administrador/admin-dashboard/admin-dashboard.component';
import { roleGuard } from './core/infraestructure/services/RoleGuard';
import { ssrAuthGuard } from './core/infraestructure/services/SsrAuthGuard';
import { ClienteHomeComponent } from './components/pages/Cliente/cliente-home/cliente-home.component'; 
import { ClienteServicesComponent } from './components/pages/Cliente/cliente-services/cliente-services.component'; 
import { ClienteNotificationsComponent } from './components/pages/Cliente/cliente-notifications/cliente-notifications.component';
import { BarberoDashboardComponent } from './components/pages/Barbero/barbero-dashboard/barbero-dashboard.component'; 

import { BarberoHomeComponent } from './components/pages/Barbero/barbero-home/barbero-home.component'; 
import { AdminHomeComponent } from './components/pages/Administrador/admin-home/admin-home.component';
import { ManageBarberComponent } from './components/pages/Administrador/manage-barber/manage-barber.component';
import { ManageServiceComponent } from './components/pages/Administrador/manage-service/manage-service.component';
import { BookingAdminComponent } from './components/organisms/booking-admin/booking-admin.component';
import { BarberServiceComponent } from './components/pages/Barbero/barber-service/barber-service.component';
import { BarberNotificationComponent } from './components/pages/Barbero/barber-notification/barber-notification.component';
import { ReportesComponent } from './components/pages/Administrador/reports/reports.component';

export const routes: Routes = [

  // =========================
  // ZONA PÚBLICA 
  // =========================
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },

  // =========================
  // ZONA CLIENTE
  // =========================
  {
    path: 'cliente',
    component: ClienteDashboardComponent,
    canActivate: [ssrAuthGuard, roleGuard],
    data: { expectedRole: 'CLIENTE' },
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: ClienteHomeComponent },
      { path: 'servicios', component: ClienteServicesComponent },
      { path: 'reservas', component: ClienteNotificationsComponent }]
  },

  // =========================
  // ZONA BARBER
  // =========================
  {
    path: 'barbero',
    component: BarberoDashboardComponent,
    canActivate: [ssrAuthGuard, roleGuard],
    data: { expectedRole: 'BARBERO' },
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: BarberoHomeComponent },
      { path: 'servicios', component: BarberServiceComponent },
      { path: 'reservas', component: BarberNotificationComponent },
    ]
  },

  // =========================
  // ZONA ADMIN
  // =========================
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [ssrAuthGuard, roleGuard],
    data: { expectedRole: 'ADMIN' },
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: AdminHomeComponent },
      { path: 'barberos', component: ManageBarberComponent },
      { path: 'servicios', component: ManageServiceComponent },
      { path: 'reservas', component: BookingAdminComponent },
      { path: 'reportes', component: ReportesComponent },
    ]
  },
  // =========================
  // WILDCARD
  // =========================
  {
    path: '**',
    redirectTo: ''
  }
];
