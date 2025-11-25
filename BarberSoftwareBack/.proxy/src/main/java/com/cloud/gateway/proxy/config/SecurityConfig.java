package com.cloud.gateway.proxy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtPermissionsConverter jwtPermissionsConverter;

    public SecurityConfig(JwtPermissionsConverter jwtPermissionsConverter) {
        this.jwtPermissionsConverter = jwtPermissionsConverter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        ReactiveJwtAuthenticationConverterAdapter reactiveAdapter =
                new ReactiveJwtAuthenticationConverterAdapter(jwtPermissionsConverter);

        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeExchange(exchanges -> exchanges
                        // 1. Rutas PÚBLICAS (Login, Registro, Swagger, etc.)
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()
                        .pathMatchers("/api/v1/usuarios/registro",
                                "/api/v1/usuarios/registro-google",
                                "/api/v1/usuarios/login").permitAll()

                        // 2. Rutas EXCLUSIVAS DE ADMINISTRADOR
                        // Ejemplo: Registrar barberos solo lo hace el admin
                        .pathMatchers("/api/v1/usuarios/registro-barbero").hasRole("ADMIN")

                        // Ejemplo: Si tienes un módulo de gestión completo
                        // .pathMatchers("/api/v1/admin/**").hasRole("ADMINISTRADOR")

                        // 3. Rutas PARA BARBEROS (y Admins quizás)
                        // .pathMatchers("/api/v1/citas/gestionar").hasAnyRole("BARBERO", "ADMINISTRADOR")

                        // 4. El resto requiere estar autenticado (sea Cliente, Barbero o Admin)
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(reactiveAdapter)
                        )
                )
                // Manejo de error 401 limpio
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((exchange, ex) -> {
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        })
                );

        return http.build();
    }

    // CONFIGURACIÓN CENTRALIZADA DE CORS
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Origen exacto de tu Front (SIN barra al final)
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true); // Importante para Auth0 a veces

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
