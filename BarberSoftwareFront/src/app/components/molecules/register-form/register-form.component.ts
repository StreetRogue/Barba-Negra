import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  @Input() isLoading = false;
  @Output() registerSubmit = new EventEmitter<FormGroup>();
  @Output() goToLogin = new EventEmitter<void>();

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerSubmit.emit(this.registerForm);
    }
  }
}
