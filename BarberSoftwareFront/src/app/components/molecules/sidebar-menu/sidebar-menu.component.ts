import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CardComponent } from '../../atoms/card/card.component';
import { NavItemComponent } from '../../atoms/nav-item/nav-item.component';
import { CommonModule } from '@angular/common';
import { LogoComponent } from "../../atoms/logo/logo.component";
import { MENU_CONFIG } from './config';

type Rol = 'client' | 'barber' | 'admin';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [LogoComponent, CommonModule, CardComponent, NavItemComponent],
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})

export class SidebarMenuComponent implements OnChanges {
  @Input() variant: Rol = 'client';
  @Input() items: { link: string | any[]; iconClass: string; label: string }[] | null = null;

  public logoVariant: 'default' | 'client' | 'barber' | 'admin' = 'default';
  public menuItems: any[] = [];

  // ngOnChanges es el hook correcto para inputs que cambian
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variant']) {
      this.updateMenuState();
    }
  }

  private updateMenuState(): void {
    // 1. Carga del menú: Prioridad al config, fallback a array vacío
    // Usamos aserción de tipo segura
    const configItems = MENU_CONFIG[this.variant as Rol];
    this.menuItems = configItems || [];

    // 2. Lógica del logo simplificada
    // Si el variant actual es válido para el logo, úsalo. Si no, default.
    const validLogoVariants = ['client', 'barber', 'admin'];
    this.logoVariant = validLogoVariants.includes(this.variant)
      ? this.variant
      : 'default';

    // Verificación de "espejo": Si no hay items, algo anda mal con el rol pasado
    if (this.menuItems.length === 0) {
      console.warn(`[Sidebar] Advertencia: No se encontraron items para el rol '${this.variant}'. Revisa tu config.ts.`);
    }
  }
}
