export interface IUsuario {
  id?: number;         // ID de tu base de datos (PostgreSQL)
  auth0Id?: string;    // ID de Auth0 (sub)
  nombre: string;
  email: string;
  telefono?: string;
  imagenUrl?: string;  // La foto de Google
  role?: string;       
}

