import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.css']
})
export class ToastNotificationComponent {

  @Input() message: string = "";
  show: boolean = false;

  // 📢 AQUÍ ES DONDE SE APLICA LA NOTIFICACIÓN
  public trigger(message: string) {
    this.message = message; // 1. Se establece el mensaje
    this.show = true;       // 2. Se cambia el estado para mostrar el toast (CSS)

    setTimeout(() => {
      this.show = false;
    }, 4500); // 3. Se programa para ocultarlo
  }
}
