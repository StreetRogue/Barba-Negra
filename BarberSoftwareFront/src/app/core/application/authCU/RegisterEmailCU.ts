import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUsuario as Usuario } from '../../domain/models/IUsuario'; 
import { AuthRepository } from '../../domain/repositories/AuthRepository';

@Injectable({ providedIn: 'root' })
export class RegisterWithEmailUseCase {
  constructor(private AuthRepository: AuthRepository) {}

  execute(usuario: Usuario): Observable<any> {
    return this.AuthRepository.register(usuario);
  }
}
