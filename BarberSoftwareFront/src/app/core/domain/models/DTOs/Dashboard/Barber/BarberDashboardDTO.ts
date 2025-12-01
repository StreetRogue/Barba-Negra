export interface BarberDashboardDTO {
  perfil: {
    nombre: string;
    foto: string;
    rating: number;
    estado: 'disponible' | 'ocupado' | 'atendiendo';
  };

  // El servicio que está ocurriendo YA
  reservaActual: {
    activo: boolean;
    cliente: string;
    servicio: string;
    horaInicio: string;
    horaFin: string;
    duracionMinutos: number;
  } | null;

  // La tarjeta de "Siguiente en la fila"
  proximoCliente: {
    nombre: string;
    servicio: string;
    hora: string; // "14:30"
    minutosFaltantes: number;
  } | null;

  // Reemplazo de "Stats de Ventas": Métricas personales
  resumenDia: {
    gananciaEstimada: number; // Suma de precios de servicios de hoy
    totalCitas: number;       // Total agendadas hoy
    citasCompletadas: number; // Las que ya pasaron
  };

  ultimasResenas: {
    autor: string;
    comentario: string;
    puntuacion: number; // 1 a 5
    fecha: string; // "Hace 2 horas"
  }[];
  
}