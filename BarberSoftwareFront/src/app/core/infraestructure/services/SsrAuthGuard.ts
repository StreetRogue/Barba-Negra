import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { authGuardFn } from '@auth0/auth0-angular';

/**
 * Guard que envuelve la protección de Auth0 para que sea segura en SSR.
 * Evita el error "location is not defined" en el servidor.
 */
export const ssrAuthGuard: CanActivateFn = (next, state) => {
  const platformId = inject(PLATFORM_ID);

  // Si estamos en el NAVEGADOR, dejamos que Auth0 haga su trabajo
  if (isPlatformBrowser(platformId)) {
    return authGuardFn(next, state);
  }

  // Si estamos en el SERVIDOR, bloqueamos la ruta para evitar el crash.
  // (No tiene sentido renderizar el Dashboard en el servidor porque no hay usuario logueado)
  return false;
};