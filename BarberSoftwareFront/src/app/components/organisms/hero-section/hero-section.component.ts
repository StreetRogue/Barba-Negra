import { Component, ElementRef, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthFacade } from '../../../core/facade/AuthFacade';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent implements AfterViewInit {

  // Referencia al video para forzar play
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  // Referencia al título para animarlo (opcional)
  @ViewChild('heroTitle') heroTitle!: ElementRef;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private authFacade: AuthFacade, private router: Router) {
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

  onReservar(): void {
    // Usamos take(1) para verificar el estado una sola vez al hacer click
    this.authFacade.isAuthenticated.pipe(take(1)).subscribe((isAuth) => {

      if (!isAuth) {
        // 1. NO AUTENTICADO -> Mandar al Login de Auth0
        console.log('Usuario no autenticado. Redirigiendo al login...');
        this.authFacade.login();

      } else {
        const usuario = this.authFacade.usuarioBackend();
        const rol = usuario?.role;
        switch (rol) {
          case 'CLIENTE':
            this.router.navigate(['/cliente/servicios']);
            break;

          case 'BARBERO':
            this.router.navigate(['/barbero/servicios']);
            break;

          case 'ADMIN':
            this.router.navigate(['/admin/servicios']);
            break;

          default:
            console.warn('Rol desconocido o usuario nulo, redirigiendo a inicio');
            this.router.navigate(['/']);
            break;
        }
      }
    });
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