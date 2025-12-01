import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css',
})
export class SearchInputComponent {
  @Input() variant: 'client' | 'admin' | 'barber' = 'client';
  @Input() placeholder: string = 'Buscar';
  @Output() searchChange = new EventEmitter<string>();

  public searchQuery: string = '';

  onModelChange(newValue: string): void {
    this.searchQuery = newValue;
    this.searchChange.emit(this.searchQuery);
  }
}
