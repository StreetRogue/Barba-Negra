import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthFacade } from '../../facade/AuthFacade';
import { filter, map, take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  const expectedRole = route.data['expectedRole'];

  console.log(`🛡️ RoleGuard iniciado. Esperando rol: ${expectedRole}`);

  // 1. Esperar a que Auth0 confirme que está logueado
  return authFacade.isAuthenticated.pipe(
    filter(isAuth => isAuth !== null), // Esperar a que cargue el SDK
    take(1),
    switchMap(isAuthenticated => {
      
      if (!isAuthenticated) {
        return of(false);
      }

      // 2. Escuchar el Observable estable que creamos en la Facade
      return authFacade.usuarioBackend$.pipe(
        // FILTRO CLAVE: El guard se detiene aquí hasta que el usuario NO sea null
        filter(user => user !== null), 
        take(1), // Tomar 1 y dejar pasar
        map(user => {
          console.log(`RoleGuard Evaluando: Usuario=${user?.nombre}, Rol=${user?.role}`);

          if (user?.role === expectedRole) {
            return true; 
          } else {
            console.warn(`Acceso Denegado. Se requiere ${expectedRole}`);
            router.navigate(['']); 
            return false;
          }
        })
      );
    })
  );
};