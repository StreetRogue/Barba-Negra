import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-widget.component.html',
  styleUrls: ['./stats-widget.component.css']
})
export class StatsWidgetComponent implements OnChanges {

  // Recibe [{ id: 1, cantidad: 10, nombreService: 'Corte' }, ...]
  @Input() data: any[] = []; 

  maxValue = 0;

  ngOnChanges() {
    this.calcularMaximo();
  }

  calcularMaximo() {
    if (!this.data || this.data.length === 0) {
      this.maxValue = 0;
      return;
    }
    // Encontrar el valor más alto para usarlo como el 100%
    this.maxValue = Math.max(...this.data.map(item => item.cantidad));
  }

  calcularPorcentaje(valor: number): number {
    if (this.maxValue === 0) return 0;
    return (valor / this.maxValue) * 100;
  }
}