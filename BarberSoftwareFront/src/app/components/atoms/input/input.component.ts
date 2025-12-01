import { Component, Input, Optional, Self } from '@angular/core'; // Agrega Optional y Self
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms'; // Agrega NgControl

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  // ⚠️ IMPORTANTE: ELIMINAMOS LA SECCIÓN 'providers' AQUÍ
  // porque inyectaremos el control directamente en el constructor.
})
export class InputComponent implements ControlValueAccessor {
  
  @Input() label: string = "";
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() controlName: string = `input-${Math.random()}`; 
  @Input() placeholder: string = ' ';

  // --- Lógica de ControlValueAccessor ---
  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  isDisabled: boolean = false;

  // INYECCIÓN DE DEPENDENCIA DE NGCONTROL
  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      // Conectamos este componente con el FormControl de Angular
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: string): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }
}