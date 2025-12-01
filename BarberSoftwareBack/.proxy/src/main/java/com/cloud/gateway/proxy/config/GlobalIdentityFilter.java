package com.cloud.gateway.proxy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class GlobalIdentityFilter implements GlobalFilter, Ordered {

    @Value("${auth0.audience}")
    private String audience; // Leemos "https://BarbaNegra.com" del yml

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        // Ignorar rutas de WebSockets para evitar romper el handshake
        if (path.equals("/ws") || path.startsWith("/ws/")) {
            return chain.filter(exchange);
        }
        // Accedemos al Contexto de Seguridad Reactivo
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .flatMap(authentication -> {

                    // Verificamos si hay un token JWT válido en la sesión actual
                    if (authentication.getPrincipal() instanceof Jwt jwt) {

                        // 1. Extraer el Email usando tu namespace
                        // Busca: "https://BarbaNegra.com/email"
                        String emailKey = audience + "/email";
                        String email = jwt.getClaimAsString(emailKey);
                        String uniqueId = jwt.getSubject();

                        // Fallback: Si no está, busca "email" estándar
                        if (email == null) {
                            email = jwt.getClaimAsString("email");
                        }

                        // 2. Si encontramos el email, generamos el ID y mutamos la petición
                        if (email != null) {
                            Integer userId = Math.abs(email.hashCode());

                            // Mutamos la petición para inyectar los headers
                            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                    .header("X-User-Unique-Id", uniqueId)
                                    .header("X-User-Id", userId.toString())
                                    .header("X-User-Email", email)
                                    .build();

                            ServerWebExchange mutatedExchange = exchange.mutate()
                                    .request(mutatedRequest)
                                    .build();

                            return chain.filter(mutatedExchange);
                        }
                    }
                    // Si no es JWT o no tiene email, seguimos sin tocar nada
                    return chain.filter(exchange);
                })
                // Si no hay contexto de seguridad (ruta pública), seguimos normal
                .switchIfEmpty(chain.filter(exchange));
    }

    @Override
    public int getOrder() {
        // Ejecutar después de la seguridad pero antes del enrutamiento
        return 1;
    }
}