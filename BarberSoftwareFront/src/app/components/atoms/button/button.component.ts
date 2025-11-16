// src/app/components/1-atoms/button/button.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TemplateRef, ContentChild } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {

  @Input() style: 'primary' | 'secondary' | 'icon' | 'overlay' = 'primary';
  @Input() link?: string;
  @Input() routerLink?: string | any[];
  @Input() type: 'submit' | 'button' = 'button';
  @Input() disabled: boolean = false;
  @ContentChild(TemplateRef) contentTpl: TemplateRef<any> | null = null;

  public isLink(): boolean {
    return !!this.link || !!this.routerLink;
  }
}