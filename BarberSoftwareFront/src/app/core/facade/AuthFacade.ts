import { Injectable, signal, Inject, Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';

// Importamos tus Casos de Uso
import { LoginUseCase } from '../application/authCU/LoginCU';
import { RegisterUseCase } from '../application/authCU/RegisterEmailCU';
import { SincronizarUsuarioUseCase } from '../application/authCU/SincronizarUsuarioCU';
import { IUsuario } from '../domain/models/IUsuario';
import { TempAuthService } from '../infraestructure/services/TempAuthService';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthFacade {

  // Signal original
  public usuarioBackend = signal<IUsuario | null>(null);

  // 👇 NUEVO: Creamos un Observable estable que el Guard pueda escuchar sin errores
  public usuarioBackend$ = toObservable(this.usuarioBackend);

  // Inicializamos con valores dummy para el servidor (evita el error de "location undefined")
  public isAuthenticated: Observable<boolean> = of(false);
  public userAuth0: Observable<any> = of(null);
  public loading: Observable<boolean> = of(false);

  // Guardamos referencia privada lazy
  private _auth0: AuthService | null = null;

  constructor(
    private injector: Injector, // <--- Lazy loading
    @Inject(PLATFORM_ID) private platformId: Object,
    private loginUC: LoginUseCase,
    private registerUC: RegisterUseCase,
    private sincronizarUC: SincronizarUsuarioUseCase,
    private tempService: TempAuthService
  ) {
    // SOLO EJECUTAR LOGICA DE AUTH0 SI ESTAMOS EN EL NAVEGADOR
    if (isPlatformBrowser(this.platformId)) {

      // Ahora sí es seguro instanciar AuthService
      this._auth0 = this.injector.get(AuthService);

      // Reconectamos los observables reales
      this.isAuthenticated = this._auth0.isAuthenticated$;
      this.userAuth0 = this._auth0.user$;
      this.loading = this._auth0.isLoading$;

      // Listener de sincronización
      this._auth0.user$.subscribe((user) => {
        if (user) {
          this.gestionarSincronizacion(user);
        } else {
          this.usuarioBackend.set(null);
        }
      });
    }
  }

  // --- ACCIONES ---

  login() {
    this.loginUC.execute().subscribe();
  }

  loginWithEmailHint(email: string) {
    this.loginUC.execute(email).subscribe();
  }

  register(datosFormulario: Partial<IUsuario>) {
    if (isPlatformBrowser(this.platformId)) {
      this.tempService.saveData(datosFormulario);

      // 2. Calcular redirect_uri
      const redirectUri = window.location.origin + '/login';

      // 3. Delegar al Caso de Uso
      this.registerUC.execute({
        emailHint: datosFormulario.email,
        redirectUri: redirectUri
      }).subscribe();
    }
  }

    logout() {
    if (isPlatformBrowser(this.platformId) && this._auth0) {
       // 1. Limpiar datos temporales (por si quedó basura de un registro a medias)
       this.tempService.clearData();

       // 2. Limpiar el estado reactivo local (opcional, pero buena práctica visual)
       this.usuarioBackend.set(null);

       // 3. Delegar a Auth0 (Esto borra tokens de localStorage y redirige)
       this._auth0.logout({ logoutParams: { returnTo: window.location.origin } });
    }
  }

  // --- LÓGICA PRIVADA ---

  private gestionarSincronizacion(userAuth0: any) {
    // Esta lógica solo se llamará en el browser porque está dentro del if del constructor
    console.log('🔄 Usuario Auth0 detectado. Iniciando sincronización con Backend...');

    const datosTemporales = this.tempService.getData();

    let usuarioParaBackend: Partial<IUsuario> = {
      email: userAuth0.email,
      nombre: userAuth0.name,
      imagenUrl: userAuth0.picture
    };

    if (datosTemporales) {
      console.log('📝 Se encontraron datos temporales de registro:', datosTemporales);
      usuarioParaBackend.nombre = datosTemporales.nombre;
      usuarioParaBackend.telefono = datosTemporales.telefono;
      this.tempService.clearData();
    }

    this.sincronizarUC.execute(usuarioParaBackend).subscribe({
      next: (usuarioDb) => {
        console.log('✅ Sincronización Exitosa:', usuarioDb);
        this.usuarioBackend.set(usuarioDb);
      },
      error: (err) => console.error('❌ Error en sincronización:', err)
    });
  }

  public getAccessTokenSilently(): Observable<string> {
    if (!this._auth0) {
      return of(''); // Retorna un observable vacío en SSR o si no está inicializado
    }
    // Auth0 por defecto usa getAccessTokenSilently sin argumentos para obtener el token.
    return this._auth0.getAccessTokenSilently();
  }
}
