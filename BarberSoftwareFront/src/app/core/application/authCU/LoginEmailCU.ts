import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs'; 
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { IAuthResponse } from '../../domain/models/IAuthResponse';

@Injectable({ providedIn: 'root' })
export class LoginWithEmailUseCase {
  constructor(private AuthRepository: AuthRepository) {}

   execute(credentials: { email: string, password: string }): Observable<IAuthResponse> {
    return this.AuthRepository.login(credentials).pipe(
      tap(response => {
        this.saveToken(response.token);
      })
    );
  }

  private saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }
}
