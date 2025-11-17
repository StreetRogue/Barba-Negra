import { Component } from '@angular/core';
import { SidebarComponent } from '../../organisms/sidebar/sidebar.component';
import { MainContentComponent } from '../../organisms/main-content/main-content.component';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  imports: [ SidebarComponent, MainContentComponent],
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.css'] 
})
export class ClienteDashboardComponent {}
