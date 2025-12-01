export interface ReservaDashboardItem {
  id: number;
  idServicio: number;
  idBarbero: number;
  nombreServicio: string; // Coincide con lo que espera tu HTML
  nombreBarbero: string;
  nombreCliente: string;  // Coincide con lo que espera tu HTML
  horaInicio: string;
  horaFin: string;
  fecha: string;
  estado: string;
}

export interface AdminDashboardDTO {
  kpi: {
    totalReservas: number;
    totalConfirmadas: number;
    totalCanceladas: number;
    totalPendientes: number;
  };

  rankingBarberos: { id: number; cantidad: number }[];
  rankingServicios: { id: number; cantidad: number }[];

  // Listas tipadas correctamente
  reservasHoy: ReservaDashboardItem[];
  reservasFuturas: ReservaDashboardItem[];
  reservasPasadas: ReservaDashboardItem[];
  
  reservaActual: ReservaDashboardItem | null;
  ultimaReservaFinalizada: ReservaDashboardItem | null;

  barberoTop: any | null; // Puedes tipar esto con BarberoDTORespuesta si quieres
  servicioTop: any | null; // Puedes tipar esto con ServicioDTORespuesta si quieres
}