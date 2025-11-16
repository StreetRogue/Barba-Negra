import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../molecules/login-form/login-form.component';
import { RegisterFormComponent } from '../../molecules/register-form/register-form.component';
import { FormGroup } from '@angular/forms';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-auth-panel',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LoginFormComponent, RegisterFormComponent],
  templateUrl: './auth-panel.component.html',
  styleUrl: './auth-panel.component.css'
})
export class AuthPanelComponent {
  @Input() isLoading = false;

  // Emite los eventos hacia la Página
  @Output() googleLogin = new EventEmitter<void>();
  @Output() loginSubmit = new EventEmitter<FormGroup>();
  @Output() registerSubmit = new EventEmitter<FormGroup>();

  // Maneja el estado de la animación
  isRightPanelActive = false;

  showLoginPanel(): void {
    this.isRightPanelActive = false;
  }
}