import { ReporteItemDTO } from "./ReporteItemDTO";

export interface ReporteRespuestaDTO {
  totalReservas: number;
  totalConfirmadas: number;
  totalCanceladas: number;
  totalPendientes: number;

  porBarbero: ReporteItemDTO[];
  porServicio: ReporteItemDTO[];
}
