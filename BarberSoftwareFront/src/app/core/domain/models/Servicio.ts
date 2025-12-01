import { ICategoria } from "./ICategoria"; 

export class Servicio {
  id!: number;
  nombre!: string;
  descripcion!: string;
  precio!: number;
  duracionMinutos!: number;
  fechaCreacion!: string;
  objCategoria: ICategoria | null = null;
  estado: 'Activo' | 'Inactivo' = 'Activo';
  imagenBase64: string | null = null;
}