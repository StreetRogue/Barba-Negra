import { CategoriaDTOPeticion } from "../Categorias/CategoriaPeticionDTO"; 

export interface ServicioDTOPeticion {
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutos: number;
    imagenBase64: string; 
    estado: string;       
    categoria: CategoriaDTOPeticion; 
}