import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/AuthRepository';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  constructor(private repo: AuthRepository) {}

  execute(params: { emailHint?: string, redirectUri?: string }): Observable<void> {
    return this.repo.register({ 
      appState: { target: '/login' },
      authorizationParams: { 
        screen_hint: 'signup',      // Forzar pantalla de registro
        login_hint: params.emailHint, // Pre-llenar email
        prompt: 'login',            // Forzar login (ignorar sesiones viejas)
        redirect_uri: params.redirectUri // URL de retorno específica
      } 
    });
  }
}