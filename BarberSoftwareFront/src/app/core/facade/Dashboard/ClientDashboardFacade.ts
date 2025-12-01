import { Injectable, inject } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ReservaFacade } from '../ReservaFacade';
import { ServicioFacade } from '../ServicioFacade';
import { BarberoFacade } from '../BarberoFacade';

import { ClientDashboardDTO } from '../../domain/models/DTOs/Dashboard/Cliente/ClientDashboardDTO'; 
import { ReservaDTORespuesta } from '../../domain/models/DTOs/Reserva/ReservaDTORespuesta';
import { BarberoDTORespuesta } from '../../domain/models/DTOs/Barbero/BarberoRespuestaDTO';
import { ServicioDTORespuesta } from '../../domain/models/DTOs/Servicio/ServicioRespuestaDTO';

@Injectable({
  providedIn: 'root'
})
export class ClientDashboardFacade {

  private reservaFacade = inject(ReservaFacade);
  private servicioFacade = inject(ServicioFacade);
  private barberoFacade = inject(BarberoFacade);

  async getClientDashboard(): Promise<ClientDashboardDTO> {
    const ahora = new Date();

    // 1. PETICIONES EN PARALELO (Base)
    const misReservas$ = this.reservaFacade.listarMisReservas().pipe(catchError(() => of([])));
    const servicios$ = this.servicioFacade.listar().pipe(catchError(() => of([])));
    const barberos$ = this.barberoFacade.listarBarberos().pipe(catchError(() => of([])));

    const [misReservas, servicios, barberos] = await firstValueFrom(
      of(null).pipe(
        map(() => Promise.all([
          firstValueFrom(misReservas$),
          firstValueFrom(servicios$),
          firstValueFrom(barberos$)
        ]))
      )
    ).then(res => res);

    const mapServicios = new Map<number, ServicioDTORespuesta>(servicios.map((s: any) => [s.id, s]));
    const mapBarberos = new Map<number, BarberoDTORespuesta>(barberos.map((b: any) => [b.id, b]));

    // --- PROCESAMIENTO ---

    // A. Widget Progreso
    const current = (misReservas || []).find((r: any) => {
      const ini = new Date(r.horaInicio);
      const fin = new Date(r.horaFin);
      return ini <= ahora && fin >= ahora && r.estado !== 'CANCELADA';
    });

    let reservaActual = null;
    if (current) {
      const ini = new Date(current.horaInicio);
      const fin = new Date(current.horaFin);
      reservaActual = {
        activo: true,
        horaInicio: current.horaInicio,
        horaFin: current.horaFin,
        duracionMinutos: Math.round((fin.getTime() - ini.getTime()) / 60000)
      };
    }

    // B. Widget Perfil (Barbero Sugerido)
    let barberoTopId = this.calcularBarberoFavorito(misReservas || []);
    if (!barberoTopId && barberos.length > 0) barberoTopId = barberos[0].id;

    const barberoData = barberoTopId ? mapBarberos.get(barberoTopId) : null;
    
    // --- LÓGICA DE ESTADO EN TIEMPO REAL (OPTIMIZADA) ---
    let estadoCalculado: 'disponible' | 'ocupado' | 'atendiendo' = 'ocupado';

    if (barberoData) {
        const estadoBD = (barberoData.estado || '').toUpperCase();
        
        if (estadoBD === 'INACTIVO') {
            estadoCalculado = 'ocupado';
        } else {
            // ✅ AHORA LLAMAMOS AL ENDPOINT LIGERO SOLO PARA ESTE BARBERO
            try {
                const agendaHoy = await firstValueFrom(
                    this.reservaFacade.listarAgendaHoyBarbero(barberoData.id).pipe(catchError(() => of([])))
                );

                const estaOcupadoAhora = agendaHoy.some((r: any) => {
                    const ini = new Date(r.horaInicio);
                    const fin = new Date(r.horaFin);
                    return ini <= ahora && fin >= ahora && 
                           r.estado !== 'CANCELADA' && 
                           r.estado !== 'COMPLETADA' && 
                           r.estado !== 'NO_PRESENTADO';
                });

                estadoCalculado = estaOcupadoAhora ? 'atendiendo' : 'disponible';

            } catch (e) {
                console.error('Error verificando agenda barbero:', e);
                estadoCalculado = 'disponible'; // Fallback optimista
            }
        }
    }

    const barberoSugerido = barberoData ? {
      nombre: barberoData.nombre,
      foto: 'assets/images/avatar.png',
      rating: 4.9,
      especialidad: 'Tu barbero frecuente',
      estado: estadoCalculado
    } : null;


    // C. Última Visita y Stats
    const pasadas = (misReservas || []).filter((r: any) => new Date(r.horaInicio) < ahora).sort((a: any, b: any) => new Date(b.horaFin).getTime() - new Date(a.horaFin).getTime());
    
    let ultimaVisita = null;
    if (pasadas.length > 0) {
      const last = pasadas[0];
      const dias = Math.floor((ahora.getTime() - new Date(last.horaFin).getTime()) / (1000 * 60 * 60 * 24));
      ultimaVisita = {
        fecha: new Date(last.horaInicio),
        nombreServicio: mapServicios.get(last.idServicio)?.nombre || 'Servicio',
        nombreBarbero: mapBarberos.get(last.idBarbero)?.nombre || 'Barbero',
        diasTranscurridos: dias
      };
    }

    const stats = {
      totalCortes: pasadas.length,
      proximaCita: null,
      servicioFavorito: 'General'
    };

    return {
      reservaActual,
      ultimaVisita,
      barberoSugerido,
      stats,
      reservasFuturas: []
    };
  }

  private calcularBarberoFavorito(reservas: ReservaDTORespuesta[]): number | null {
    if (!reservas || reservas.length === 0) return null;
    const conteo: Record<number, number> = {};
    let maxId = null;
    let maxCount = 0;
    reservas.forEach(r => {
      conteo[r.idBarbero] = (conteo[r.idBarbero] || 0) + 1;
      if (conteo[r.idBarbero] > maxCount) {
        maxCount = conteo[r.idBarbero];
        maxId = r.idBarbero;
      }
    });
    return maxId;
  }
}