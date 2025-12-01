import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-bar-chart.component.html',
  styleUrls: ['./custom-bar-chart.component.css']
})
export class CustomBarChartComponent implements OnChanges {

  // Recibe datos en formato: [{ label: 'Juan', value: 10 }, ...]
  @Input() data: { label: string; value: number }[] = [];
  @Input() title: string = '';
  @Input() icon: string = 'bi-bar-chart';

  maxValue = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      // Encontramos el valor máximo para que esa barra sea el 100%
      this.maxValue = Math.max(...this.data.map(d => d.value), 1); // Mínimo 1 para evitar división por cero
    }
  }

  // Calcula el porcentaje de ancho
  getWidth(value: number): string {
    const percent = (value / this.maxValue) * 100;
    return `${percent}%`;
  }
}