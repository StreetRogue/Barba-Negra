import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';
import Swal from 'sweetalert2'; // Asegúrate de tenerlo instalado

// Validador local (o impórtalo si lo creaste en otro lado)
function noWhitespaceValidator(control: AbstractControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  // Solo valida si el campo ya tiene el validador required
  if (control.value === '' || control.value === null) return null; 
  return !isWhitespace ? null : { 'whitespace': true };
}

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  @Input() isLoading = false;
  @Output() registerSubmit = new EventEmitter<FormGroup>();
  @Output() goToLogin = new EventEmitter<void>();

  registerForm = new FormGroup({
    // Agregamos noWhitespaceValidator a los campos de texto
    name: new FormControl('', [Validators.required, noWhitespaceValidator]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    email: new FormControl('', [Validators.required, Validators.email, noWhitespaceValidator])
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerSubmit.emit(this.registerForm);
    } else {
      // 1. Marca todos los campos como "tocados" para que se pongan rojos en la UI
      this.registerForm.markAllAsTouched();

      // 2. Muestra la alerta visual
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Por favor completa todos los campos correctamente. No dejes espacios en blanco.',
        confirmButtonColor: '#D4AF37', // Tu color dorado
        confirmButtonText: 'Entendido'
      });
    }
  }
}