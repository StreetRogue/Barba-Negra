import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthPanelComponent } from '../../organisms/auth-panel/auth-panel.component';
import { AuthFacade } from '../../../core/facade/AuthFacade';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, AuthPanelComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginPageComponent {

  @ViewChild(AuthPanelComponent) authPanel!: AuthPanelComponent;

  isLoading = false;

  constructor(private authFacade: AuthFacade, private router: Router) { }



  handleLoginSubmit(form: FormGroup): void {
    this.isLoading = true;
    const { email, password } = form.value;
    this.authFacade.login(email, password).subscribe({
      next: (res) => this.handleSuccessLogin(res),
      error: (err) => this.handleError(err)
    });
  }

  handleLoginGoogleSubmit(): void {
    this.isLoading = true;
    // Abre la URL de inicio de sesión con Google en una ventana emergente.
    const url = 'http://localhost:9000/oauth2/authorization/google';
    window.location.href = url;
    
  }

  handleRegisterSubmit(form: FormGroup): void {
    this.isLoading = true;
    const { name, phone, email, password } = form.value;
    this.authFacade.register({
      nombre: name,
      telefono: phone,
      email,
      password
    }).subscribe({
      next: (res) => this.handleSuccessRegister(res),
      error: (err) => this.handleError(err)
    });
  }

  private handleSuccessRegister(response: any): void {
    console.log("REGISTRO EXITOSO:", response); // response no contendrá un token aquí
    this.isLoading = false;
    // Opcional: Mostrar un mensaje de éxito (ej. con un snackbar)
    // alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    this.authPanel.showLoginPanel();
  }

  private handleSuccessLogin(response: any): void {
    console.log("LOGIN EXITOSO:", response.token);
    this.isLoading = false;
    this.router.navigate(['/cliente']);
  }

  private handleError(error: any): void {
    console.error("LOGIN/REGISTRO FALLIDO:", error);
    this.isLoading = false;
  }
}