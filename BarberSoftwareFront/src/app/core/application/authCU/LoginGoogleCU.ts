import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthResponse } from '../../domain/models/IAuthResponse'; 
import { AuthRepository } from '../../domain/repositories/AuthRepository';

@Injectable({ providedIn: 'root' })
export class LoginWithGoogleUseCase {
  constructor(private repo: AuthRepository) {}

  execute(): Observable<IAuthResponse> {
    return this.repo.loginWithGoogle();
  }
}
