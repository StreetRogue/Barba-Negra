import { Injectable, inject } from '@angular/core';
import { firstValueFrom, of } from 'rxjs'; 
import { catchError, map } from 'rxjs/operators'; 

// Importación de Fachadas de Dominio
import { ReservaFacade } from '../ReservaFacade';
import { ServicioFacade } from '../ServicioFacade';
import { BarberoFacade } from '../BarberoFacade';
import { ReporteFacade } from '../ReporteFacade';

// Importación de DTOs
import { AdminDashboardDTO, ReservaDashboardItem } from '../../domain/models/DTOs/Dashboard/Admin/AdminDashboardDTO';
import { ServicioDTORespuesta } from '../../domain/models/DTOs/Servicio/ServicioRespuestaDTO';
import { BarberoDTORespuesta } from '../../domain/models/DTOs/Barbero/BarberoRespuestaDTO';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardFacade {

  // Inyección de dependencias
  private reservaFacade = inject(ReservaFacade);
  private servicioFacade = inject(ServicioFacade);
  private barberoFacade = inject(BarberoFacade);
  private reporteFacade = inject(ReporteFacade);

  /**
   * Obtiene toda la información necesaria para el Dashboard del Administrador.
   * Ejecuta peticiones en paralelo y maneja fallos de forma silenciosa (graceful degradation).
   */
  async getDashboardAdmin(): Promise<AdminDashboardDTO> {
    const hoy = new Date();
    // Primer día del mes actual para los KPIs
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // ============================================================
    // 1. PREPARACIÓN DE OBSERVABLES (CON CATCH ERROR)
    // ============================================================
    
    // A. Reservas (Si falla, devuelve array vacío)
    const reservas$ = this.reservaFacade.listarTodas().pipe(
      catchError(err => {
        console.warn('⚠️ Error cargando reservas:', err); 
        return of([]); 
      })
    );

    // B. Servicios (Si falla, devuelve array vacío)
    const servicios$ = this.servicioFacade.listar().pipe(
      catchError(() => of([] as ServicioDTORespuesta[]))
    );

    // C. Barberos (Si falla, devuelve array vacío)
    const barberos$ = this.barberoFacade.listarBarberos().pipe(
      catchError(() => of([] as BarberoDTORespuesta[]))
    );

    // D. Reporte KPI (Si falla, devuelve objeto con ceros)
    const kpi$ = this.reporteFacade.obtenerReporteKPI({
      fechaInicio: inicioMes.toISOString().split('T')[0],
      fechaFin: hoy.toISOString().split('T')[0],
      idBarbero: undefined,
      idServicio: undefined
    }).pipe(
      catchError(err => {
        console.warn('⚠️ Error en KPIs:', err);
        return of({ 
          totalReservas: 0,
          totalConfirmadas: 0,
          totalCanceladas: 0,
          totalPendientes: 0,
          porBarbero: [],
          porServicio: []
        });
      })
    );

    // ============================================================
    // 2. EJECUCIÓN PARALELA (OPTIMIZACIÓN DE TIEMPO)
    // ============================================================
    const [reservas, servicios, barberos, kpi] = await firstValueFrom(
      of(null).pipe(
        map(() => Promise.all([
          firstValueFrom(reservas$),
          firstValueFrom(servicios$),
          firstValueFrom(barberos$),
          firstValueFrom(kpi$)
        ]))
      )
    ).then(res => res);


    // ============================================================
    // 3. MAPEO Y TRANSFORMACIÓN DE DATOS
    // ============================================================
    
    // Mapas para búsqueda rápida O(1)
    const mapServicios = new Map(servicios.map(s => [s.id, s]));
    const mapBarberos = new Map(barberos.map(b => [b.id, b]));

    // Transformamos las reservas crudas a objetos listos para la UI
    const reservasUI: ReservaDashboardItem[] = (reservas || []).map(r => {
      const servicio = mapServicios.get(r.idServicio);
      const barbero = mapBarberos.get(r.idBarbero);
      
      return {
        id: r.idReserva,
        idServicio: r.idServicio,
        idBarbero: r.idBarbero,
        nombreServicio: servicio?.nombre ?? 'Servicio no disp.',
        nombreBarbero: barbero?.nombre ?? 'Sin asignar',
        nombreCliente: `Cliente #${r.idUsuario}`, // Placeholder hasta tener endpoint de usuarios
        horaInicio: r.horaInicio,
        horaFin: r.horaFin,
        fecha: r.horaInicio ? r.horaInicio.split('T')[0] : '',
        estado: r.estado 
      };
    });

    // ============================================================
    // 4. FILTROS Y LÓGICA DE TIEMPO
    // ============================================================
    const ahora = new Date();
    const validReservas = reservasUI || []; // Aseguramos que no sea null

    // Reservas de HOY (Pendientes) para el calendario o lista rápida
    const reservasHoy = validReservas.filter(r => 
      r.fecha === hoy.toISOString().split('T')[0] && 
      r.estado === 'PENDIENTE'
    );
    
    // Reservas FUTURAS (A partir de ahora)
    const reservasFuturas = validReservas.filter(r => 
      new Date(r.horaInicio) > ahora && 
      r.estado === 'PENDIENTE'
    );
    
    // Reservas PASADAS (Historial)
    const reservasPasadas = validReservas.filter(r => 
      new Date(r.horaInicio) < ahora
    );

    // Reserva ACTUAL (En proceso)
    // Coincide con hora actual y no está cancelada
    const reservaActual = validReservas.find(r => {
        const ini = new Date(r.horaInicio);
        const fin = new Date(r.horaFin);
        return ini <= ahora && fin >= ahora && r.estado !== 'CANCELADA';
    }) ?? null;

    // Última reserva FINALIZADA (Para mostrar actividad reciente)
    const ultimaReservaFinalizada = reservasPasadas.length
      ? reservasPasadas.sort((a, b) => new Date(b.horaFin).getTime() - new Date(a.horaFin).getTime())[0]
      : null;

    // ============================================================
    // 5. CÁLCULO DE TOP PERFORMERS + ESTADO EN TIEMPO REAL
    // ============================================================
    
    // Top Servicio (Basado en KPI)
    const servicioTop = (kpi.porServicio && kpi.porServicio.length > 0)
      ? mapServicios.get(kpi.porServicio[0].id) ?? null
      : null;

    // Top Barbero (Basado en KPI) con cálculo de disponibilidad
    let barberoTop = null;

    if (kpi.porBarbero && kpi.porBarbero.length > 0) {
        const topId = kpi.porBarbero[0].id;
        const datosBase = mapBarberos.get(topId);

        if (datosBase) {
            // Lógica de estado dinámico
            let estadoReal = 'ocupado';
            const estadoBD = (datosBase.estado || '').toUpperCase();
            
            if (estadoBD === 'ACTIVO') {
                // Buscamos si este barbero específico tiene una reserva activa AHORA MISMO
                const estaOcupadoAhora = validReservas.some(r => 
                    r.idBarbero === topId &&
                    new Date(r.horaInicio) <= ahora &&
                    new Date(r.horaFin) >= ahora &&
                    r.estado !== 'CANCELADA' &&
                    r.estado !== 'COMPLETADA' &&
                    r.estado !== 'NO_PRESENTADO'
                );

                estadoReal = estaOcupadoAhora ? 'atendiendo' : 'disponible';
            }

            // Construimos el objeto final mezclando datos base + estado calculado
            barberoTop = {
                ...datosBase,
                imagenUrl: (datosBase as any).imagenBase64 || (datosBase as any).imagenUrl || 'assets/images/avatar.png',
                estado: estadoReal 
            };
        }
    }

    // ============================================================
    // 6. RETORNO DEL DTO FINAL
    // ============================================================
    return {
      kpi: {
        totalReservas: kpi.totalReservas || 0,
        totalConfirmadas: kpi.totalConfirmadas || 0,
        totalCanceladas: kpi.totalCanceladas || 0,
        totalPendientes: kpi.totalPendientes || 0
      },
      rankingBarberos: kpi.porBarbero || [],
      rankingServicios: kpi.porServicio || [],
      
      reservasHoy,
      reservasFuturas,
      reservasPasadas,
      
      reservaActual,
      ultimaReservaFinalizada,
      
      barberoTop, 
      servicioTop
    };
  }
}