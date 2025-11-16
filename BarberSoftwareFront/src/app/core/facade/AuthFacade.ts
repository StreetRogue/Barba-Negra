import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IAuthResponse } from '../domain/models/IAuthResponse';
import { LoginWithEmailUseCase } from '../application/authCU/LoginEmailCU';
import { RegisterWithEmailUseCase } from '../application/authCU/RegisterEmailCU';
import { IUsuario as Usuario } from '../domain/models/IUsuario';
import { LoginWithGoogleUseCase } from '../application/authCU/LoginGoogleCU';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private authState: WritableSignal<IAuthResponse | null> = signal(null);
  loading = signal(false);
  error = signal<string | null>(null);


  constructor(
    private loginEmailUC: LoginWithEmailUseCase,
    private registerUC: RegisterWithEmailUseCase,
    private loginWithGoogleUseCase: LoginWithGoogleUseCase
  ) { }


  register(usuario: Usuario) {
    return this.registerUC.execute(usuario);
  }

  login(email: string, password: string) {
    return this.loginEmailUC.execute({ email, password });
  }

  loginGoogle() {
    return this.loginWithGoogleUseCase.execute();
  }


  logout(): void {
    this.authState.set(null); // Borra el estado
    // (Aquí borrarías el token de localStorage)
  }

  private handleSuccess(response: IAuthResponse) {
    this.authState.set(response); 
    this.loading.set(false);
    this.error.set(null);
  }

  private handleError(error: any): Observable<never> {
    this.loading.set(false);
    this.error.set(error.message || 'Error desconocido');
    return throwError(() => error);
  }
}
