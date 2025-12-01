import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './welcome-card.component.html',
  styleUrl: './welcome-card.component.css'
})
export class WelcomeCardComponent {
  @Input() variant: 'client' | 'admin' | 'barber' = 'client';
  @Input() userName: string = 'Usuario';
  @Input() title: string = '';
  @Input() subtitle: string = '';
}
