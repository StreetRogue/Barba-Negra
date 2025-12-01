import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular'; // SDK
import { EMPTY, Observable, from, map } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { IUsuario } from '../../domain/models/IUsuario';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthRepositoryImpl extends AuthRepository {
  
  private readonly apiUrl = `${environment.apiGatewayUrl}/api/v1/usuarios`;

  constructor(
    private http: HttpClient,
    private injector: Injector, // <--- 1. Inyectamos el Injector para carga perezosa
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super();
  }

  private get auth0(): AuthService | null {
    if (isPlatformBrowser(this.platformId)) {
      return this.injector.get(AuthService);
    }
    return null; // En el servidor retornamos null para evitar el crash
  }

  // Ahora acepta opciones y las pasa al SDK
  login(options?: any): Observable<void> {
     if (!this.auth0) return EMPTY;
    return from(this.auth0.loginWithRedirect(options));
  }

  register(options?: any): Observable<void> {
    if (!this.auth0) return EMPTY;
    return from(this.auth0.loginWithRedirect(options));
  }


  logout(): void {
    if (!this.auth0) return;

    // Validación extra: window.location solo existe en el navegador
    const returnUrl = isPlatformBrowser(this.platformId) ? window.location.origin : '';

    this.auth0.logout({ 
        logoutParams: { returnTo: returnUrl } 
    });
  }

  sincronizar(usuarioAuth0: Partial<IUsuario>): Observable<IUsuario> {
    return this.http.post<IUsuario>(`${this.apiUrl}/sincronizar`, usuarioAuth0);
  }

}