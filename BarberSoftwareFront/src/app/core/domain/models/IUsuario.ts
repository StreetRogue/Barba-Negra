export interface IUsuario {
  nombre: string;
  email: string;
  password?: string; // Opcional, porque no siempre lo manejaremos
  telefono: string;
  id?: string; // Opcional, para cuando recibamos datos del usuario logueado
}

