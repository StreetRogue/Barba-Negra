import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';

function noWhitespaceValidator(control: AbstractControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  if (control.value === '' || control.value === null) return null; 
  return !isWhitespace ? null : { 'whitespace': true };
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  @Input() isLoading = false;
  @Output() googleLogin = new EventEmitter<void>();
  @Output() loginSubmit = new EventEmitter<FormGroup>();
  @Output() goToRegister = new EventEmitter<void>();

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, noWhitespaceValidator]),
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginSubmit.emit(this.loginForm);
    } else {
      this.loginForm.markAllAsTouched();
      
      Swal.fire({
        icon: 'warning',
        title: 'Campo incompleto',
        text: 'Por favor ingresa un correo electrónico válido.',
        confirmButtonColor: '#D4AF37'
      });
    }
  }
}