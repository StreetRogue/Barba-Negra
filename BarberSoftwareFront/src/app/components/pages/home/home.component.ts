// src/app/pages/home/home.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationComponent } from '../../organisms/location/location.component';
import { HeroSectionComponent } from '../../organisms/hero-section/hero-section.component';
import { ServicesCarouselComponent } from '../services-carousel/services-carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    ServicesCarouselComponent, // El nuevo carrusel
    LocationComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
