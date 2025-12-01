import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/AuthRepository';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(private repo: AuthRepository) {}

  execute(emailHint?: string): Observable<void> {
    const options = emailHint 
      ? { authorizationParams: { login_hint: emailHint } }
      : undefined;

    return this.repo.login(options);
  }
}