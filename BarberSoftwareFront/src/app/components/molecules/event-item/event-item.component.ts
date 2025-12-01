import { Component, Input } from '@angular/core';
import { CardComponent } from '../../atoms/card/card.component';

@Component({
  selector: 'app-event-item',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.css'
})
export class EventItemComponent {
  @Input() title: string = '';
  @Input() date: string = '';
}
