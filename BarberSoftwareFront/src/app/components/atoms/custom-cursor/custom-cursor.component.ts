import { Component, ElementRef, HostListener, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [],
  templateUrl: './custom-cursor.component.html',
  styleUrl: './custom-cursor.component.css'
})
export class CustomCursorComponent implements AfterViewInit {
  @ViewChild('cursor') cursor!: ElementRef<HTMLDivElement>;

  private xTo!: gsap.QuickToFunc;
  private yTo!: gsap.QuickToFunc;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.xTo = gsap.quickTo(this.cursor.nativeElement, 'x', { duration: 0.3, ease: 'power3.out' });
      this.yTo = gsap.quickTo(this.cursor.nativeElement, 'y', { duration: 0.3, ease: 'power3.out' });
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isBrowser && this.xTo && this.yTo) {
      this.xTo(event.clientX);
      this.yTo(event.clientY);
    }
  }
}
