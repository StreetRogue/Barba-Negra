import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { ServicioRepository } from './app/core/domain/repositories/ServicioRepository';
import { ServicioRepositoryImpl } from './app/core/infraestructure/serviceRepository/ServicioRepositoryImpl'; 
import { CategoriaRepository } from './app/core/domain/repositories/CategoriaRepository';
import { CategoriaRepositoryImpl } from './app/core/infraestructure/serviceRepository/CategoriaRepositoryImpl';
import { AuthRepository } from './app/core/domain/repositories/AuthRepository';
import { AuthRepositoryImpl } from './app/core/infraestructure/serviceRepository/AuthRepositoryImpl';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(), 
    { provide: ServicioRepository, useClass: ServicioRepositoryImpl },
    { provide: CategoriaRepository, useClass: CategoriaRepositoryImpl },
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
  ]
}).catch(err => console.error(err));