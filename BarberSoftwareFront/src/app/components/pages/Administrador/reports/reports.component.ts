import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Componentes
import { CustomBarChartComponent } from '../../../molecules/custom-bar-chart/custom-bar-chart.component'; 

// Fachadas y DTOs
import { ReporteFacade } from '../../../../core/facade/ReporteFacade';
import { BarberoFacade } from '../../../../core/facade/BarberoFacade';
import { ServicioFacade } from '../../../../core/facade/ServicioFacade';
import { ReporteRespuestaDTO } from '../../../../core/domain/models/DTOs/Reportes/ReporteRespuestaDTO';
import { HistorialReservaDTORespuesta } from '../../../../core/domain/models/DTOs/Reportes/HistorialReservaDTORespuesta';
import { BarberoDTORespuesta } from '../../../../core/domain/models/DTOs/Barbero/BarberoRespuestaDTO';
import { ServicioDTORespuesta } from '../../../../core/domain/models/DTOs/Servicio/ServicioRespuestaDTO';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomBarChartComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportesComponent implements OnInit {

  private reporteFacade = inject(ReporteFacade);
  private barberoFacade = inject(BarberoFacade);
  private servicioFacade = inject(ServicioFacade);

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  idBarbero: number | undefined = undefined;
  idServicio: number | undefined = undefined;

  // Datos
  reporte: ReporteRespuestaDTO | null = null;
  historial: HistorialReservaDTORespuesta[] = [];
  
  // Catalogos para selects y mapeo de nombres
  listaBarberos: BarberoDTORespuesta[] = [];
  listaServicios: ServicioDTORespuesta[] = [];
  
  // Mapas para buscar nombres rápido por ID
  private mapBarberos = new Map<number, string>();
  private mapServicios = new Map<number, string>();

  ngOnInit() {
    this.inicializarFechas();
    this.cargarCatalogosYReporte();
  }

  // 1. Configurar fechas por defecto (Mes actual)
  inicializarFechas() {
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    
    this.fechaInicio = primerDia.toISOString().split('T')[0];
    this.fechaFin = hoy.toISOString().split('T')[0];
  }

  // 2. Cargar Barberos, Servicios y luego el Reporte
  cargarCatalogosYReporte() {
    forkJoin({
      barberos: this.barberoFacade.listarBarberos(),
      servicios: this.servicioFacade.listar()
    }).subscribe({
      next: (res) => {
        this.listaBarberos = res.barberos;
        this.listaServicios = res.servicios;

        // Llenar mapas para traducir ID -> Nombre en las gráficas
        this.listaBarberos.forEach(b => this.mapBarberos.set(b.id, b.nombre));
        this.listaServicios.forEach(s => this.mapServicios.set(s.id, s.nombre));

        // Ya tenemos nombres, ahora cargamos los números
        this.aplicarFiltros();
      }
    });
  }

  aplicarFiltros() {
    this.reporteFacade.obtenerReporteKPI({
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      idBarbero: this.idBarbero,
      idServicio: this.idServicio
    }).subscribe({
      next: (data) => {
        this.reporte = data;
      },
      error: (err) => console.error('Error cargando reporte', err)
    });
  }

  limpiar() {
    this.inicializarFechas();
    this.idBarbero = undefined;
    this.idServicio = undefined;
    this.aplicarFiltros();
  }

  // --- TRANSFORMACIÓN DE DATOS PARA LAS GRÁFICAS ---
  
  get datosGraficaBarberos() {
    if (!this.reporte) return [];
    return this.reporte.porBarbero.map(item => ({
      // Usamos el Map para obtener el nombre real, o un fallback
      label: this.mapBarberos.get(item.id) || `Barbero #${item.id}`,
      value: item.cantidad
    })).sort((a, b) => b.value - a.value); // Ordenar mayor a menor
  }

  get datosGraficaServicios() {
    if (!this.reporte) return [];
    return this.reporte.porServicio.map(item => ({
      label: this.mapServicios.get(item.id) || `Servicio #${item.id}`,
      value: item.cantidad
    })).sort((a, b) => b.value - a.value);
  }

  // --- EXPORTAR PDF ---
  exportarPDF() {
    if (!this.reporte) return;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte de Gestión - BarbaNegra', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Período: ${this.fechaInicio} a ${this.fechaFin}`, 14, 30);

    // Tabla de KPIs
    autoTable(doc, {
      startY: 40,
      head: [['Total', 'Confirmadas', 'Canceladas', 'Pendientes']],
      body: [[
        this.reporte.totalReservas, 
        this.reporte.totalConfirmadas, 
        this.reporte.totalCanceladas, 
        this.reporte.totalPendientes
      ]],
      theme: 'grid',
      headStyles: { fillColor: [212, 175, 55] } // Dorado
    });

    doc.save(`reporte_${this.fechaInicio}.pdf`);
  }
}