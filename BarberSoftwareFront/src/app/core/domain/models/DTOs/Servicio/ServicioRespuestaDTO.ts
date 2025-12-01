import { CategoriaDTORespuesta } from "../Categorias/CategoriaRespuestaDTO"; 

export interface ServicioDTORespuesta {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutos: number;
    fechaCreacion: string; 
    imagenBase64: string;
    estado: string;
    categoria: CategoriaDTORespuesta;
}