import { Observable } from 'rxjs';
import { IUsuario } from '../models/IUsuario';

export abstract class AuthRepository {
  abstract login(options?: any): Observable<void>;
  abstract register(options?: any): Observable<void>;
  abstract logout(): void;
  abstract sincronizar(usuarioAuth0: Partial<IUsuario>): Observable<IUsuario>;
}