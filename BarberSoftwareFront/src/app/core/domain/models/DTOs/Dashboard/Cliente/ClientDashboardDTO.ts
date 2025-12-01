export interface ClientDashboardDTO {
  // Para el Widget de Progreso
  reservaActual: {
    activo: boolean;
    horaInicio: string;
    horaFin: string;
    duracionMinutos: number;
  } | null;

  // Para el Widget de Rebooking (Última visita)
  ultimaVisita: {
    fecha: Date | null;
    nombreServicio: string;
    nombreBarbero: string;
    diasTranscurridos: number;
  } | null;

  // Para el Widget de Perfil (Barbero Favorito o Sugerido)
  barberoSugerido: {
    nombre: string;
    foto: string;
    rating: number;
    especialidad: string;
    estado: 'atendiendo' | 'disponible' | 'ocupado';
  } | null;

  // Para el Widget de Estadísticas
  stats: {
    totalCortes: number;
    proximaCita: string | null; // Fecha formateada o null
    servicioFavorito: string;
  };

  // Para el Calendario (y lista si decidieras usarla)
  reservasFuturas: any[]; 
}