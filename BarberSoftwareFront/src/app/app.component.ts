import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/organisms/header/header.component';
import { FooterComponent } from './components/organisms/footer/footer.component';
import { filter } from 'rxjs';
import { NotificationService } from './core/infraestructure/services/NotificacionService';
import { ToastNotificationComponent } from './components/molecules/toast-notification/toast-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet, ToastNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Barba Negra';
  showMainLayout = true;
  showMobileNav = true;
  // 1. Referencia al Toast Component en el HTML
  @ViewChild('toast') toastNotifier!: ToastNotificationComponent;

  constructor(private router: Router, private notificationService: NotificationService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;

        // ---- Lógica para mostrar/ocultar el layout principal
        this.showMainLayout = !(
          url.startsWith('/cliente') || url.startsWith('/barbero') || url.startsWith('/admin')

        );
      });
  }

  ngOnInit(): void {
    // 2. Suscribirse al stream de notificaciones del servicio
    this.notificationService.notificacion$.subscribe(
      (message) => {
        // 3. Cuando se recibe un mensaje, se llama al método trigger()
        //    del componente Toast para mostrarlo.
        this.toastNotifier?.trigger(message);
      }
    );
  }


}
