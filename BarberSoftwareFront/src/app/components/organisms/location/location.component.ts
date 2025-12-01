import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {
  @Input() address: string = "Cra 23a # 6a-23, Popayán, Colombia";
  @Input() schedule: string = "Lunes a Sábado: 9:00 AM - 8:00 PM";
  @Input() phone: string = "(+57) 321 4567890";
 }
