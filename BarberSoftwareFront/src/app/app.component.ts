import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/organisms/header/header.component'; 
import { FooterComponent } from './components/organisms/footer/footer.component';
import { MobileNavComponent } from './components/organisms/mobile-nav/mobile-nav.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,HeaderComponent,FooterComponent, RouterOutlet, MobileNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BarberSoftwareFront';
  showMobileNav = true;
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        // Oculta en páginas como login, register, etc.
        this.showMobileNav = !(
          url.includes('login') || url.includes('register') || url.includes('forgot-password')
        );
      });
  }

}
