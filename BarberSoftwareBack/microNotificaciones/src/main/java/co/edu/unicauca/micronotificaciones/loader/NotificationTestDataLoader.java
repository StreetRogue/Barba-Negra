//package co.edu.unicauca.micronotificaciones.loader;
//
//import co.edu.unicauca.micronotificaciones.services.DTOs.ReservaNotificacionDTO;
//import co.edu.unicauca.micronotificaciones.services.NotificacionFacade;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//
//@Component
//public class NotificationTestDataLoader implements CommandLineRunner {
//
//    private final NotificacionFacade fachada;
//
//    public NotificationTestDataLoader(NotificacionFacade fachada) {
//        this.fachada = fachada;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        System.out.println("----------------------------------------------------------------");
//        System.out.println("🤖 Ejecutando DataLoader de Pruebas COMPLETAS (Programación, Cancelación, Reprogramación)...");
//
//        // Definiciones de IDs y Formato
//        final Long CLIENTE_ID = 999L;
//        final Long BARBERO_ID = 456L;
//        final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");
//
//        // La reserva de prueba se iniciará en 2 horas y 15 minutos.
//        LocalDateTime horaBase = LocalDateTime.now().plusHours(2).plusMinutes(2);
//
//        // Simulación de Tiempos
//        LocalDateTime horaInicioOriginal = horaBase;
//        LocalDateTime horaFinOriginal = horaInicioOriginal.plusMinutes(30); // Duración de 30 min.
//
//        // --- ESCENARIO 1: CONFIRMACIÓN Y PROGRAMACIÓN (ID: 1001) ---
//
//        System.out.println("\n--- 1. ESCENARIO CONFIRMACIÓN (ID: 1001) ---");
//
//        ReservaNotificacionDTO reserva1 = new ReservaNotificacionDTO(
//                1001L,
//                CLIENTE_ID,
//                BARBERO_ID,
//                horaInicioOriginal,
//                horaFinOriginal,
//                "Corte de Cabello Básico",
//                "CONFIRMADA" // Estado inicial
//        );
//
//        // Disparar la lógica de creación (programa 4 recordatorios para esta hora)
//        fachada.procesarReserva(reserva1);
//
//        System.out.println("   * Tareas originales programadas para las: " + horaInicioOriginal.format(FORMATTER));
//        System.out.println("   * (Verificar Log: 4 recordatorios programados en total).");
//
//
//        // --- ESCENARIO 2: CANCELACIÓN INMEDIATA (ID: 1002) ---
//
//        // Simular una reserva que ocurre 5 horas después
//        LocalDateTime horaInicioCancelada = LocalDateTime.now().plusHours(5);
//        LocalDateTime horaFinCancelada = horaInicioCancelada.plusMinutes(60);
//
//        ReservaNotificacionDTO reserva2 = new ReservaNotificacionDTO(
//                1002L,
//                111L, // Otro Cliente
//                BARBERO_ID,
//                horaInicioCancelada,
//                horaFinCancelada,
//                "Afeitado Clásico",
//                "CONFIRMADA" // Primero se CONFIRMA para que se programen los timers
//        );
//        fachada.procesarReserva(reserva2);
//
//        // Simular el mensaje de cancelación 5 segundos después
//        Thread.sleep(5000);
//
//        System.out.println("\n--- 2. ESCENARIO CANCELACIÓN (ID: 1002) ---");
//
//        reserva2.setEstado("CANCELADA"); // Cambiamos el estado
//        fachada.procesarReserva(reserva2); // Enviamos el mensaje de cancelación
//
//        System.out.println("   * Notificación INMEDIATA de cancelación enviada al Cliente (111).");
//        System.out.println("   * (Verificar Log: 4 tareas para ID 1002 fueron **canceladas**).");
//
//
//        // --- ESCENARIO 3: REPROGRAMACIÓN (ID: 1003) ---
//
//        LocalDateTime horaInicioReprog = LocalDateTime.now().plusHours(3);
//        LocalDateTime horaFinReprog = horaInicioReprog.plusMinutes(45);
//
//        ReservaNotificacionDTO reserva3 = new ReservaNotificacionDTO(
//                1003L,
//                CLIENTE_ID, // Cliente 999
//                BARBERO_ID,
//                horaInicioReprog.minusHours(1), // Hora de inicio ORIGINAL (ej. hace 1 hora)
//                horaFinReprog.minusHours(1),
//                "Tinte y Peinado",
//                "CONFIRMADA"
//        );
//        fachada.procesarReserva(reserva3);
//
//        // Simular el mensaje de reprogramación 5 segundos después
//        Thread.sleep(5000);
//
//        // Nueva hora: 2 horas después de la original
//        LocalDateTime nuevaHoraInicio = reserva3.getHoraInicio().plusHours(2);
//        LocalDateTime nuevaHoraFin = reserva3.getHoraFin().plusHours(2);
//
//        System.out.println("\n--- 3. ESCENARIO REPROGRAMACIÓN (ID: 1003) ---");
//
//        reserva3.setEstado("REPROGRAMADA");
//        reserva3.setHoraInicio(nuevaHoraInicio); // Establecer nueva hora
//        reserva3.setHoraFin(nuevaHoraFin);      // Establecer nuevo fin
//
//        fachada.procesarReserva(reserva3);
//
//        System.out.println("   * Tareas viejas (ID 1003) fueron **canceladas**.");
//        System.out.println("   * Nuevas tareas programadas para las: " + nuevaHoraInicio.format(FORMATTER));
//        System.out.println("   * (Verificar Log: Se cancelaron 4 tareas y se programaron 4 nuevas).");
//
//
//        System.out.println("\n----------------------------------------------------------------");
//        System.out.println("🚨 ¡IMPORTANTE! Abre el index.html y conecta al CLIENTE (999) y al BARBERO (456).");
//        System.out.println("   - Espera 2 horas (o ajusta horaBase) para que lleguen las notificaciones de la Reserva 1001.");
//        System.out.println("----------------------------------------------------------------");
//    }
//}