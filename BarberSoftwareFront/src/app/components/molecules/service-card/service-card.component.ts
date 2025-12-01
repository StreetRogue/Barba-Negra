// src/app/components/2-molecules/service-card/service-card.component.ts

// 1. Importa HostListener, ElementRef y ViewChild
import { Component, Input, HostListener, ElementRef, ViewChild, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule], // ¡Asegúrate de importar CommonModule!
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css'
})
export class ServiceCardComponent implements AfterViewInit {

  @Input() imageSrc: string = "";
  @Input() title: string = "Título";
  @Input() description: string = "Descripción...";
  @ViewChild('cardWrapper') cardWrapper!: ElementRef<HTMLDivElement>;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.resetTilt();
  }

  // 3. Escucha el movimiento del mouse SOBRE LA TARJETA
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isBrowser) return;

    const el = this.cardWrapper.nativeElement;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const intensity = 15;  // Define la intensidad de la inclinación

    el.style.setProperty('--rotateX', `${-y * intensity}deg`);
    el.style.setProperty('--rotateY', `${x * intensity}deg`);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.isBrowser) return;
    this.resetTilt();
  }

  private resetTilt(): void {
    const el = this.cardWrapper.nativeElement;
    el.style.setProperty('--rotateX', '0deg');
    el.style.setProperty('--rotateY', '0deg');
  }
}