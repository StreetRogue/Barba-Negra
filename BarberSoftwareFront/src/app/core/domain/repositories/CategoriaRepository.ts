import { Observable } from 'rxjs';
import { CategoriaDTORespuesta } from '../models/DTOs/Categorias/CategoriaRespuestaDTO'; 

export abstract class CategoriaRepository {
    abstract listarCategorias(): Observable<CategoriaDTORespuesta[]>;
}