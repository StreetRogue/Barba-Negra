import { Component, ElementRef, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
  // host: { 'ngSkipHydration': 'true' } // Intenta quitar esto si no es estrictamente necesario
})
export class HeroSectionComponent implements AfterViewInit {
  
  // Referencia al video para forzar play
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  
  // Referencia al título para animarlo (opcional)
  @ViewChild('heroTitle') heroTitle!: ElementRef;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // 1. Forzar reproducción del video
      this.playVideo();

      // 2. Iniciar animaciones de texto (Solo si el elemento existe)
      if (this.heroTitle) {
        this.initAnimations();
      }
    }
  }

  playVideo(): void {
    const video = this.heroVideo?.nativeElement;
    if (video) {
      video.muted = true; // Los navegadores bloquean autoplay si no está muteado
      video.play().catch(error => {
        console.warn('El video no pudo reproducirse automáticamente:', error);
      });
    }
  }

  initAnimations(): void {
    gsap.registerPlugin(ScrollTrigger);

    // Animación simple de entrada para el título
    gsap.from(this.heroTitle.nativeElement, {
      y: 50,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out',
      delay: 0.5
    });
  }
}