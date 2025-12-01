import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UpgradeCardComponent } from '../../molecules/upgrade-card/upgrade-card.component';
import { SidebarMenuComponent } from '../../molecules/sidebar-menu/sidebar-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [UpgradeCardComponent, SidebarMenuComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() variant: 'client' | 'barber' | 'admin' = 'client';
  @Input() items: any[] | null = null;
  @Output() close = new EventEmitter<void>();
}
