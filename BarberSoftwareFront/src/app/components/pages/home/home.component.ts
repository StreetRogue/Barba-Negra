// src/app/pages/home/home.component.ts

// 1. Importa 'read' y 'QueryList'
import { Component, ElementRef, AfterViewInit, ViewChild, ViewChildren, QueryList, Inject, PLATFORM_ID} from '@angular/core';
import { LocationComponent } from '../../organisms/location/location.component';
import { HeroSectionComponent } from '../../organisms/hero-section/hero-section.component';
import { ServiceCardComponent } from '../../molecules/service-card/service-card.component'; 
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LocationComponent,
    HeroSectionComponent,
    ServiceCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',

  // Arreglo de hidratación
  host: { 'ngSkipHydration': 'true' }
})
export class HomeComponent implements AfterViewInit {
  
  // 2. Añade ViewChild para el título y ViewChildren para las tarjetas
  @ViewChild('serviceTitle') serviceTitle!: ElementRef;
  @ViewChildren(ServiceCardComponent, { read: ElementRef }) serviceCards!: QueryList<ElementRef>;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
      this.initServiceAnimations();
    }
  }

  initServiceAnimations(): void {
    // 3. Animación para el título
    gsap.from(this.serviceTitle.nativeElement, {
      scrollTrigger: {
        trigger: this.serviceTitle.nativeElement,
        start: 'top 80%', // Empieza cuando el 80% del título entra en pantalla
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out',
    });

    // 4. Animación ESCALONADA (stagger) para las tarjetas
    gsap.from(this.serviceCards.map(card => card.nativeElement), {
      scrollTrigger: {
        trigger: this.serviceCards.first.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.2, // ¡Esta es la clave! Anima una tras otra con 0.2s de retraso
    });
  }
}