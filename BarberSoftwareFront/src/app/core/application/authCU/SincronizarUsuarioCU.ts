import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { IUsuario } from '../../domain/models/IUsuario';

@Injectable({ providedIn: 'root' })
export class SincronizarUsuarioUseCase {
  constructor(private repo: AuthRepository) {}
    execute(usuarioListo: Partial<IUsuario>): Observable<IUsuario> {
    return this.repo.sincronizar(usuarioListo);
  }
}