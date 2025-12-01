import { Injectable, inject } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Fachadas del Dominio
import { ReservaFacade } from '../ReservaFacade';
import { ServicioFacade } from '../ServicioFacade';
import { AuthFacade } from '../AuthFacade';

// DTOs
import { BarberDashboardDTO } from '../../domain/models/DTOs/Dashboard/Barber/BarberDashboardDTO';
import { ServicioDTORespuesta } from '../../domain/models/DTOs/Servicio/ServicioRespuestaDTO';
import { ReservaDTORespuesta } from '../../domain/models/DTOs/Reserva/ReservaDTORespuesta';

@Injectable({
  providedIn: 'root'
})
export class BarberDashboardFacade {

  private reservaFacade = inject(ReservaFacade);
  private servicioFacade = inject(ServicioFacade);
  private authFacade = inject(AuthFacade);

  async getBarberDashboard(): Promise<BarberDashboardDTO> {
    const ahora = new Date();
    // Ajuste de zona horaria simple para comparar fechas string (YYYY-MM-DD)
    const hoyString = ahora.toISOString().split('T')[0];
    
    const user = this.authFacade.usuarioBackend(); // Datos del barbero logueado

    // ============================================================
    // 1. CARGA DE DATOS (PARALELO & SEGURO)
    // ============================================================
    
    // Obtenemos SOLO las reservas de este barbero (usando su token)
    const agenda$ = this.reservaFacade.listarReservasPorBarbero().pipe(
      catchError(err => {
        console.warn('⚠️ Error cargando agenda:', err);
        return of([]);
      })
    );

    const servicios$ = this.servicioFacade.listar().pipe(
      catchError(() => of([] as ServicioDTORespuesta[]))
    );

    const [agendaTotal, servicios] = await firstValueFrom(
      of(null).pipe(
        map(() => Promise.all([
          firstValueFrom(agenda$),
          firstValueFrom(servicios$)
        ]))
      )
    ).then(res => res);

    // Mapa de precios para calcular ganancias rápidamente
    const mapServicios = new Map<number, ServicioDTORespuesta>(servicios.map((s: any) => [s.id, s]));

    // ============================================================
    // 2. PROCESAMIENTO DE DATOS
    // ============================================================

    // A. Filtrar solo reservas de HOY y validas
    const agendaHoy = (agendaTotal || []).filter((r: any) => 
      // Compara la parte de la fecha (string) o usa lógica de Date
      r.horaInicio.startsWith(hoyString) && 
      r.estado !== 'CANCELADA' && 
      r.estado !== 'NO_PRESENTADO'
    );

    // Ordenar por hora de inicio
    agendaHoy.sort((a: any, b: any) => new Date(a.horaInicio).getTime() - new Date(b.horaInicio).getTime());

    // B. Calcular Estado Actual y Progreso
    let estadoActual: 'disponible' | 'ocupado' | 'atendiendo' = 'disponible';
    let reservaActual = null;

    const currentReserva = agendaHoy.find((r: any) => {
      const ini = new Date(r.horaInicio).getTime();
      const fin = new Date(r.horaFin).getTime();
      const now = ahora.getTime();
      // Está ocurriendo ahora mismo
      return now >= ini && now < fin;
    });

    if (currentReserva) {
      estadoActual = 'atendiendo';
      const ini = new Date(currentReserva.horaInicio);
      const fin = new Date(currentReserva.horaFin);
      
      reservaActual = {
        activo: true,
        cliente: `Cliente #${currentReserva.idUsuario}`, // TODO: Usar nombre real si el endpoint lo trae
        servicio: mapServicios.get(currentReserva.idServicio)?.nombre || 'Servicio',
        horaInicio: currentReserva.horaInicio,
        horaFin: currentReserva.horaFin,
        duracionMinutos: Math.round((fin.getTime() - ini.getTime()) / 60000)
      };
    }

    // C. Próximo Cliente
    const nextReserva = agendaHoy.find((r: any) => new Date(r.horaInicio).getTime() > ahora.getTime());
    let proximoCliente = null;
    
    if (nextReserva) {
      const diffMs = new Date(nextReserva.horaInicio).getTime() - ahora.getTime();
      const minutosFaltantes = Math.ceil(diffMs / 60000);
      
      proximoCliente = {
        nombre: `Cliente #${nextReserva.idUsuario}`,
        servicio: mapServicios.get(nextReserva.idServicio)?.nombre || 'Corte',
        hora: new Date(nextReserva.horaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        minutosFaltantes
      };
    }

    // D. KPIs Financieros (Resumen del Día)
    let gananciaEstimada = 0;
    let completadas = 0;

    agendaHoy.forEach((r: ReservaDTORespuesta) => {
      const precio = mapServicios.get(r.idServicio)?.precio || 0;
      gananciaEstimada += precio;

      // Contamos como completada si el estado es COMPLETADA o si ya pasó la hora y no se canceló
      if (r.estado === 'COMPLETADA' || new Date(r.horaFin) < ahora) {
        completadas++;
      }
    });

    // ============================================================
    // 3. MOCK DE RESEÑAS (Hasta tener el microservicio)
    // ============================================================
    const ultimasResenas = [
      { 
        autor: 'Carlos M.', 
        comentario: 'Excelente corte, muy detallista con el fade.', 
        puntuacion: 5, 
        fecha: 'Hace 2 horas' 
      },
      { 
        autor: 'Luis D.', 
        comentario: 'Buen ambiente, profesional.', 
        puntuacion: 4, 
        fecha: 'Ayer' 
      },
      { 
        autor: 'Ana R.', 
        comentario: 'Llevé a mi hijo y quedó encantado. ¡Gracias!', 
        puntuacion: 5, 
        fecha: 'Hace 2 días' 
      }
    ];

    // ============================================================
    // 4. RETORNO DTO
    // ============================================================
    return {
      perfil: {
        nombre: user?.nombre || 'Barbero',
        foto: user?.imagenUrl || 'assets/images/avatar.png',
        rating: 4.9, 
        estado: estadoActual
      },
      reservaActual,
      proximoCliente,
      resumenDia: {
        gananciaEstimada,
        totalCitas: agendaHoy.length,
        citasCompletadas: completadas
      },
      ultimasResenas
    };
  }
}