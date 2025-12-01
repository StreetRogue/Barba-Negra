package co.edu.unicauca.micronotificaciones.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;
public class UserHandShakeInterceptor implements HandshakeInterceptor {

    /*
    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        // Validamos que sea una petición Servlet (para poder leer params)
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;

            // 1. Leer el ID desde la URL (Query Param: ?userId=123)
            String userId = servletRequest.getServletRequest().getParameter("userId");

            if (userId != null) {
                // 2. Guardar en sesión
                attributes.put("userId", userId);
                System.out.println("🔗 Handshake: ID [" + userId + "] asociado a la sesión.");
                return true;
            }
        }

        System.err.println("❌ Handshake fallido: Falta parámetro userId en la URL.");
        return false;
    }
    */


    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        // 🟢 CLAVE: Permitir el paso del Handshake HTTP/SockJS.
        // La autenticación real se gestionará en el protocolo STOMP por StompPrincipalFactory.
        System.out.println("🔗 Handshake: Pasando. La seguridad se gestionará en el protocolo STOMP.");
        return true; // Permitir siempre el Handshake
    }
    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
    }
}
