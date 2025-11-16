import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-mobile-nav-item',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './mobile-nav-item.component.html',
  styleUrl: './mobile-nav-item.component.css'
})
export class MobileNavItemComponent {
  @Input() icon: string = 'bi-question-circle'; 
  @Input() link?: string; 
  
  // --- Salidas (Outputs) ---
  @Output() itemClick = new EventEmitter<void>();

  public isLink(): boolean {
    return !!this.link;
  }
}