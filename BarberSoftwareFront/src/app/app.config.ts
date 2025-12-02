import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAuth0, authHttpInterceptorFn } from '@auth0/auth0-angular';
import { AuthRepository } from './core/domain/repositories/AuthRepository';
import { AuthRepositoryImpl } from './core/infraestructure/serviceRepository/AuthRepositoryImpl';
import { AuthFacade } from './core/facade/AuthFacade';
import { ServicioRepository } from './core/domain/repositories/ServicioRepository';
import { ServicioRepositoryImpl } from './core/infraestructure/serviceRepository/ServicioRepositoryImpl';
import { BarberoRepository } from './core/domain/repositories/BarberRepository'; 
import { BarberoRepositoryImpl } from './core/infraestructure/serviceRepository/BarberoRepositoryImpl';
import { BarberoFacade } from './core/facade/BarberoFacade';
import { ListarBarberoUseCase } from './core/application/barberoCU/ListarBarberoCU';
import { CategoriaRepository } from './core/domain/repositories/CategoriaRepository';
import { CategoriaRepositoryImpl } from './core/infraestructure/serviceRepository/CategoriaRepositoryImpl';
import { CategoriaFacade } from './core/facade/CategoriaFacade';
import { AgendaRepository } from './core/domain/repositories/AgendaRepository';
import { AgendaRepositoryImpl } from './core/infraestructure/serviceRepository/AgendaRepositoryImpl';
import { AgendaFacade } from './core/facade/AgendaFacade';
import { ReservaRepository } from './core/domain/repositories/ReservaRepository';
import { ReservaRepositoryImpl } from './core/infraestructure/serviceRepository/ReservaRepositoryImpl';
import { ReservaFacade } from './core/facade/ReservaFacade';
import { NotificationService } from './core/infraestructure/services/NotificacionService';
import { ReporteRepository } from './core/domain/repositories/ReporteRepository';
import { ReporteRepositoryImpl } from './core/infraestructure/serviceRepository/ReporteRepositoryImpl';
import { ReporteFacade } from './core/facade/ReporteFacade';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideAnimations(),
    provideHttpClient(withFetch(),
    withInterceptors([authHttpInterceptorFn])),

    provideAuth0({
      domain: 'dev-q8voma4k1vi0ux1s.us.auth0.com', // Ej: dev-xxxx.us.auth0.com
      clientId: 'pDbt1Skhn7HEalU2LtidtFWaS03WW5wI',    // El Client ID de "Barberia Frontend"
      useRefreshTokens: true,    
      cacheLocation: 'localstorage',
      authorizationParams: {
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
        audience: 'https://BarbaNegra.com', 
      },
      // Configuración del Interceptor: ¿A qué URLs se les debe poner Token?
      httpInterceptor: {
        allowedList: [
          {
            // URL API Gateway
            uri: `${environment.apiGatewayUrl}/api/v1/*`, 
            tokenOptions: {
              authorizationParams: {
                audience: 'https://BarbaNegra.com' 
              }
            }
          }
        ]
      }
    }),

    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: BarberoRepository, useClass: BarberoRepositoryImpl },
    { provide: ServicioRepository, useClass: ServicioRepositoryImpl },
    { provide: CategoriaRepository, useClass: CategoriaRepositoryImpl },
    { provide: AgendaRepository, useClass: AgendaRepositoryImpl },
    { provide: ReservaRepository, useClass: ReservaRepositoryImpl },
    { provide: ReporteRepository, useClass: ReporteRepositoryImpl },
    importProvidersFrom(FormsModule),
    provideClientHydration(),
    AuthFacade,
    BarberoFacade,
    ListarBarberoUseCase,
    CategoriaFacade,
    AgendaFacade,
    ReservaFacade,
    NotificationService,
    ReporteFacade
  ]
};
