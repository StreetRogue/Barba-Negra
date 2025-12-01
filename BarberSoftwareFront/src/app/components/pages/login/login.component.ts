import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPanelComponent } from '../../organisms/auth-panel/auth-panel.component';
import { AuthFacade } from '../../../core/facade/AuthFacade';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, take, switchMap, map, timeout, catchError } from 'rxjs/operators';
import { timer, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, AuthPanelComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginPageComponent implements OnInit {

  @ViewChild(AuthPanelComponent) authPanel!: AuthPanelComponent;

  isInternalLoading = false;
  auth0Loading$ = this.authFacade.loading;
  isAuthenticated$ = this.authFacade.isAuthenticated;

  constructor(private authFacade: AuthFacade, private router: Router) { }

  ngOnInit(): void {
    this.authFacade.isAuthenticated
      .pipe(
        filter(isAuth => isAuth === true),

        switchMap(() => 
          timer(0, 100).pipe( 
            map(() => this.authFacade.usuarioBackend()), 
            filter(user => !!user && !!user.role), 
            take(1), 
            timeout(4000), 
            catchError(() => of(this.authFacade.usuarioBackend())) 
          )
        )
      )
      .subscribe((user) => { // Aquí recibimos el usuario YA cargado
        console.log('Usuario sincronizado y listo. Redirigiendo...', user);
        
        let route = '/cliente'; // Default

        if (user?.role === 'ADMIN') route = '/admin';
        else if (user?.role === 'BARBERO') route = '/barbero';

        this.router.navigate([route]);
      });
  }

  handleLoginSubmit(form: FormGroup): void {
    this.isInternalLoading = true;
    const { email } = form.value;
    this.authFacade.loginWithEmailHint(email);
  }

  // 2. LOGIN CON GOOGLE
  handleLoginGoogleSubmit(): void {
    this.isInternalLoading = true;
    this.authFacade.login();
  }

  handleRegisterSubmit(form: FormGroup): void {
    this.isInternalLoading = true;
    const { name, phone, email } = form.value;
    this.authFacade.register({
      nombre: name,
      telefono: phone,
      email: email
    });
  }

}