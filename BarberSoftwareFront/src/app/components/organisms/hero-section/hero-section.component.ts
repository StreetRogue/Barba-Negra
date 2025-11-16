import { Component, ElementRef, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
  host: { 'ngSkipHydration': 'true' }
})
export class HeroSectionComponent implements AfterViewInit {
  @ViewChild('heroLine1') heroLine1!: ElementRef;
  @ViewChild('heroLine2') heroLine2!: ElementRef;
  @ViewChild('flipWord') flipWord!: ElementRef;
  @ViewChild('heroBtn', { read: ElementRef }) heroBtn!: ElementRef;
  @ViewChild('heroSubtext') heroSubtext!: ElementRef;
  @ViewChild('heroTopLayer') heroTopLayer!: ElementRef<HTMLDivElement>;

  private isBrowser: boolean;
  private xTo!: gsap.QuickToFunc;
  private yTo!: gsap.QuickToFunc;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      const el = this.heroTopLayer.nativeElement;
      el.style.setProperty('--x', '50');
      el.style.setProperty('--y', '50');
      this.initMaskAnimation();
      this.initAnimations();
    }
  }

  initAnimations(): void {
    // 1. Registrar plugins de GSAP
    gsap.registerPlugin(ScrollTrigger);

    // --- 2. Animación de entrada para el resto del Héroe ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(this.heroLine1.nativeElement, { opacity: 1, duration: 0.8 })
      .to(this.heroLine2.nativeElement, { opacity: 1, duration: 0.8 }, "-=0.6")
      .to(this.flipWord.nativeElement, { opacity: 1, duration: 0.8 }, "-=0.7")
      .to(this.heroBtn.nativeElement, { opacity: 1, duration: 0.6 }, 1.2)
      .to(this.heroSubtext.nativeElement, { opacity: 1, duration: 0.6 }, "-=0.4");
  }

  initMaskAnimation(): void {

    this.xTo = gsap.quickTo(this.heroTopLayer.nativeElement, '--x', {
      duration: 0.5,
      ease: 'power3.out'
    });

    this.yTo = gsap.quickTo(this.heroTopLayer.nativeElement, '--y', {
      duration: 0.5,
      ease: 'power3.out'
    });
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isBrowser && this.xTo && this.yTo) {
      const stage = event.currentTarget as HTMLElement;
      const rect = stage.getBoundingClientRect();

      // Calculamos la posición del mouse dentro del área del hero
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Actualizamos las variables CSS en píxeles
      this.xTo(x);
      this.yTo(y);
    }
  }



}
