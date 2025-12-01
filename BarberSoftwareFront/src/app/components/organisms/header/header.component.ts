import { Component, computed, HostListener } from '@angular/core';
import { AuthFacade } from '../../../core/facade/AuthFacade';
import { RouterLink, Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs';
import { ButtonComponent } from '../../atoms/button/button.component';
import { LogoComponent } from '../../atoms/logo/logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonComponent, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  host: { 'ngSkipHydration': 'true' }
})
export class HeaderComponent {
  isHome: boolean = false;
  isScrolled = false;
  isLoginPage = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isLoginPage) return;
    this.isScrolled = window.scrollY > 20;
  }

  // Computed para calcular la ruta dinámicamente
  dashboardRoute = computed(() => {
    const user = this.authFacade.usuarioBackend();
    if (!user) return '/login';

    switch (user.role) {
      case 'ADMIN': return '/admin';
      case 'BARBERO': return '/barbero';
      case 'CLIENTE': return '/cliente';
      default: return '/cliente';
    }
  });

  constructor(
    private router: Router,
    private authFacade: AuthFacade
  ) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.checkUrl(event.urlAfterRedirects));
  }

  ngOnInit() {
    this.checkUrl(this.router.url);
    this.router.events.pipe(
      filter((e: RouterEvent): e is NavigationEnd => e instanceof
        NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      // Verificamos si la URL actual incluye 'login'
      this.isLoginPage = e.url.includes('/login');
    });
  }

  private checkUrl(url: string) {
    this.isHome = url === '/' || url.startsWith('/home');
  }
}
