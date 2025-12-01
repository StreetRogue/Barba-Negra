package co.edu.unicauca.micronotificaciones.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompPrincipalFactory stompPrincipalFactory;

    public WebSocketConfig(StompPrincipalFactory stompPrincipalFactory) {
        this.stompPrincipalFactory = stompPrincipalFactory;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {

        // 1. Canales de SALIDA (Broker/Servidor -> Cliente)
        // Usaremos /queue para los canales privados y /topic (si alguna vez se necesita broadcast)
        config.enableSimpleBroker("/queue", "/topic");

        // 2. Prefijo para mensajes de ENTRADA (Cliente -> Controller)
        // El cliente enviará mensajes a /app/solicitarHistorial o /app/marcarLeido
        config.setApplicationDestinationPrefixes("/app");

        // 3. Prefijo de Destino Privado (Para SimpMessagingTemplate.convertAndSendToUser)
        // Usaremos el prefijo /user para alinear con el estándar de Spring, pero puedes usar /apiChatPrivado si quieres.
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .addInterceptors(new UserHandShakeInterceptor());
                //.withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Registramos el interceptor que establece el objeto Principal
        // El objeto ChannelRegistration SÍ debe ser accesible
        registration.interceptors(stompPrincipalFactory);
    }

}