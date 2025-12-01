import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventItemComponent } from '../../molecules/event-item/event-item.component';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, EventItemComponent],
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent {

  @Input() variant: 'client' | 'barber' | 'admin' = 'admin';

  @Input() events: any[] = [];
}
