import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface ServiceItem {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-services-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-carousel.component.html',
  styleUrls: ['./services-carousel.component.scss']
})
export class ServicesCarouselComponent {

  activeIndex = 1; // Empezamos en el del medio para que se vea simétrico al cargar

  services: ServiceItem[] = [
    {
      title: 'Atención al cliente',
      description: "Nos caracterizamos por ofrecer una atención al cliente excepcional. En Barba Negra no solo cuidamos tu estilo, también cuidamos de ti. Siempre estamos dispuestos a escucharte, conversar y asegurarnos de que te sientas cómodo desde el primer momento en que cruzas la puerta.",
      image: 'assets/images/HomeImg1.svg'
    },
    {
      title: 'Precios Competitivos',
      description: 'En Barba Negra creemos que la calidad no tiene por qué ser inaccesible. Por eso ofrecemos precios competitivos que se ajustan a tu presupuesto sin sacrificar el estilo, la técnica o la experiencia.Nos esforzamos por brindarte un servicio de primer nivel a un costo justo, transparente y coherente con el valor que recibes.',
      image: 'assets/images/HomeImg2.svg'
    },
    {
      title: 'Servicio Profesional',
      description: 'En Barba Negra nos distingue la excelencia en cada detalle. Nuestro equipo de barberos combina técnica, precisión y dedicación para ofrecerte un servicio verdaderamente profesional. No solo transformamos tu estilo, también te brindamos una experiencia de calidad, con asesoría personalizada y un ambiente en el que la confianza y el buen trato son parte esencial de nuestro trabajo. Aquí, tu imagen está en manos expertas.',
      image: 'assets/images/HomeImg3.png'
    },
    {
      title: 'Amplios Espacios',
      description: 'En Barba Negra hemos creado un ambiente pensado para tu comodidad. Contamos con áreas amplias, modernas y bien distribuidas que te permiten relajarte y disfrutar plenamente de tu visita. Cada rincón está diseñado para ofrecerte una experiencia agradable, libre de prisas y con el confort que mereces. Aquí, el espacio también forma parte del servicio.',
      image: 'assets/images/HomeImg4.png'
    }
  ];

  nextService() {
    if (this.activeIndex < this.services.length - 1) {
      this.activeIndex++;
    } else {
      this.activeIndex = 0; // Loop al inicio
    }
  }

  prevService() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    } else {
      this.activeIndex = this.services.length - 1; // Loop al final
    }
  }

  // Lógica para asignar clases CSS según la posición
  getCardClass(index: number): string {
    if (index === this.activeIndex) return 'card-active';

    // Lógica circular para el elemento previo
    if (index === this.activeIndex - 1 || (this.activeIndex === 0 && index === this.services.length - 1)) {
      return 'card-prev';
    }

    // Lógica circular para el elemento siguiente
    if (index === this.activeIndex + 1 || (this.activeIndex === this.services.length - 1 && index === 0)) {
      return 'card-next';
    }

    return 'card-hidden';
  }
}