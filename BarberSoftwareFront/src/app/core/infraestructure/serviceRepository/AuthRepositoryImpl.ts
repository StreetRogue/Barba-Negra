import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/AuthRepository'; 
import { IAuthResponse } from '../../domain/models/IAuthResponse'; 
import { IUsuario as Usuario } from '../../domain/models/IUsuario';

@Injectable({ providedIn: 'root' })
export class AuthRepositoryImpl extends AuthRepository {
  private readonly apiUrl = 'http://localhost:9000/api/v1'
  constructor(private http: HttpClient) {
    super();
  }

  register(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/registro`, usuario);
  }

  login(credentials: { email: string; password: string }): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/usuarios/login`, credentials);
  }

  loginWithGoogle(): Observable<IAuthResponse> {
    return this.http.get<IAuthResponse>(`http://localhost:9000/oauth2/authorization/google`);
  }
}