import { Injectable, inject } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { AuthFacade } from '../../facade/AuthFacade';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private stompClient: Client | null = null;
  private connected = false;

  // 🔥 Evento global de notificaciones
  public notificacion$ = new Subject<string>();

  private authFacade = inject(AuthFacade);

  constructor() {
    this.authFacade.usuarioBackend$.subscribe(usuario => {
      if (usuario && !this.connected) {
        console.log("🔌 Usuario detectado, iniciando WebSocket...");
        this.connect();
      }

      if (!usuario && this.connected) {
        console.log("🔌 Usuario NULL, desconectando WebSocket...");
        this.disconnect();
      }
    });
  }

  private connect() {
    const userId = this.authFacade.usuarioBackend()?.id;

    if (!userId) {
      console.warn("No hay ID de usuario, no conecto WS");
      return;
    }

    this.authFacade.getAccessTokenSilently().subscribe({
      next: (token) => {
        const socket = new WebSocket(environment.websocketsUrl);

        this.stompClient = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          connectHeaders: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId.toString(),
          },
        });

        this.stompClient.onConnect = () => {
        console.log(`WS conectado para user ${userId}`);
        this.connected = true;
        const destination = `/topic/user-${userId}`; 

        this.stompClient?.subscribe(destination, msg => { 
            if (msg.body) {
                this.notificacion$.next(msg.body); 
            }
        });
    };

        this.stompClient.onWebSocketClose = () => {
          console.log("WebSocket cerrado");
          this.connected = false;
        };

        this.stompClient.activate();
      }
    });
  }

  public disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.connected = false;
      console.log("WS desconectado");
    }
  }
}
