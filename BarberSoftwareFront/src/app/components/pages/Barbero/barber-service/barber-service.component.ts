import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberoFacade } from '../../../../core/facade/BarberoFacade';
import { ServicioFacade } from '../../../../core/facade/ServicioFacade';
import { ServicioDTORespuesta } from '../../../../core/domain/models/DTOs/Servicio/ServicioRespuestaDTO';
import { AuthFacade } from '../../../../core/facade/AuthFacade';

@Component({
  selector: 'app-barber-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barber-service.component.html',
  styleUrls: ['./barber-service.component.css']
})
export class BarberServiceComponent implements OnInit {

  listaServicios: ServicioDTORespuesta[] = [];
  activeIndex: number = 0;

  barberoId!: number;
  

  constructor(
    private barberoFacade: BarberoFacade,
    private servicioFacade: ServicioFacade,
    private authFacade: AuthFacade
  ) {}

   ngOnInit(): void {
    const usuario = this.authFacade.usuarioBackend();

    if (!usuario?.id) {
      console.error("⚠ No se encontró el ID del barbero autenticado.");
      return;
    }

    this.barberoId = usuario.id;  
    this.cargarServiciosAsignados();
  }

  cargarServiciosAsignados(): void {
    this.barberoFacade.listarServiciosAsignados(this.barberoId).subscribe(resp => {

      const idsServicios = resp.map(x => x.servicioId);

      idsServicios.forEach(id => {
        this.servicioFacade.consultar(id).subscribe(serv => {
          this.listaServicios.push(serv);
        });
      });

    });
  }

  // ---------------------------
  // CONTROLES DEL CARRUSEL
  // ---------------------------
  next(): void {
    if (this.listaServicios.length > 0) {
      this.activeIndex = (this.activeIndex + 1) % this.listaServicios.length;
    }
  }

  prev(): void {
    if (this.listaServicios.length > 0) {
      this.activeIndex =
        (this.activeIndex - 1 + this.listaServicios.length) %
        this.listaServicios.length;
    }
  }

  setActive(index: number): void {
    this.activeIndex = index;
  }

  getClass(i: number): string {
    if (i === this.activeIndex) return "card-center";

    if (
      i === this.activeIndex - 1 ||
      (this.activeIndex === 0 && i === this.listaServicios.length - 1)
    ) return "card-left";

    if (
      i === this.activeIndex + 1 ||
      (this.activeIndex === this.listaServicios.length - 1 && i === 0)
    ) return "card-right";

    return "card-hidden";
  }
}
