export const environment = {
  production: true,
  // Esta variable la usa tu AgendaRepository y el Interceptor de Auth0
  apiGatewayUrl: 'https://barba-negra-proxy-production.up.railway.app',
  
  // Esta variable la usa tu NotificationService
  // Apuntamos al Gateway, el cual redirigirá /ws al micro de notificaciones
  websocketsUrl: 'wss://barba-negra-proxy-production.up.railway.app/ws'
};