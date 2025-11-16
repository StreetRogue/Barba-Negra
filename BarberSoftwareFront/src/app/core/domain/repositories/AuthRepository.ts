import { Observable } from 'rxjs';
import { IAuthResponse} from '../models/IAuthResponse'; 
import { IUsuario as Usuario } from '../models/IUsuario';

export abstract class AuthRepository {
  abstract register(usuario: Usuario): Observable<any>; 
  abstract login(credentials: { email: string, password: string }): Observable<IAuthResponse>;
  abstract loginWithGoogle(): Observable<IAuthResponse>;
}
