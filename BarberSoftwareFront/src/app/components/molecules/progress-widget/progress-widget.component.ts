import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-widget.component.html',
  styleUrls: ['./progress-widget.component.css']
})
export class ProgressWidgetComponent implements OnInit, OnDestroy, OnChanges { 

  @Input() startTime: Date | null = null;
  @Input() durationMinutes = 0;

  circleLength = 100.53; 
  dashOffset = "100.53"; 
  
  displayValue = 0;
  remainingMinutes = 0;
  
  interval: any;

  ngOnInit() {
    this.updateProgress();
    this.interval = setInterval(() => this.updateProgress(), 1000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['startTime'] || changes['durationMinutes']) {
      this.updateProgress();
    }
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  updateProgress() {
    if (!this.startTime) {
      this.displayValue = 0;
      this.remainingMinutes = 0;
      this.dashOffset = this.circleLength.toString(); // Resetear barra
      return;
    }


    const startDate = new Date(this.startTime);
    const now = Date.now();
    const start = startDate.getTime();
    const end = start + (this.durationMinutes * 60000);

    const totalDuration = end - start;
    const elapsed = now - start;
    
    let percentage = (elapsed / totalDuration) * 100;
    
    percentage = Math.max(0, Math.min(100, percentage));

    this.displayValue = Math.round(percentage);

    const offset = this.circleLength - (this.circleLength * percentage / 100);
    this.dashOffset = offset.toString();


    const remainingMs = end - now;
    this.remainingMinutes = Math.max(0, Math.ceil(remainingMs / 60000));

    
    if (percentage >= 100) clearInterval(this.interval);
  }
}