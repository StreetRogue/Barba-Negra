import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.css'
})
export class LogoComponent {
  @Input() variant: 'default' | 'client' | 'barber' | 'hero' | 'admin' = 'default';

  get logoSrc(): string {
    switch (this.variant) {
      case 'client':
        return 'assets/images/BarbaNegraLogoDashboardCliente.png';
      case 'barber':
        return 'assets/images/BarbaNegraLogoDashboardBarbero.png';
      case 'hero':
        return 'assets/images/HeroWhiteLogo.png';
      case 'admin':
        return 'assets/images/BarbaNegraLogoDashboardBarbero.png';
      default:
        return 'assets/images/BarbaNegraLogo.png';
    }
  }
}
