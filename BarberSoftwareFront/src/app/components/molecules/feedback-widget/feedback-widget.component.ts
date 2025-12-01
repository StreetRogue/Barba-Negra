import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feedback-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-widget.component.html',
  styleUrl: './feedback-widget.component.css'
})
export class FeedbackWidgetComponent {
  @Input() reviews: any[] = [];
}
