import { Component } from '@angular/core';
import { LogoComponent } from '../../atoms/logo/logo.component';
import { SidebarNavComponent } from '../../molecules/sidebar-nav/sidebar-nav.component';
import { UpgradeCardComponent } from '../../atoms/upgrade-card/upgrade-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LogoComponent, SidebarNavComponent, UpgradeCardComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
