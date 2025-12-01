package co.edu.unicauca.micronotificaciones.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Map;

@Component
public class StompPrincipalFactory implements ChannelInterceptor {

    // Simple clase Principal para inyectar el ID
    private static class StompPrincipal implements Principal {
        private final String name;
        public StompPrincipal(String name) { this.name = name; }
        @Override
        public String getName() { return name; }
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        // 1. Solo actuamos cuando se recibe el comando CONNECT (inicio de conexión)
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            // 🟢 CLAVE: LEER EL ID DESDE EL HEADER STOMP 'User-ID'
            String userId = accessor.getFirstNativeHeader("User-ID");

            if (userId != null) {
                // 2. Crear el Principal con el ID del Usuario y establecerlo
                Principal principal = new StompPrincipal(userId);
                accessor.setUser(principal);
                System.out.println("✅ STOMP Connect: Principal establecido para ID: " + userId);
            } else {
                System.err.println("❌ STOMP Connect Fallido: Header 'User-ID' no encontrado en el frame CONNECT.");
                // Opcional: Podrías lanzar una excepción o cerrar la conexión si la autenticación es obligatoria aquí.
            }
        }
        return message;
    }

}