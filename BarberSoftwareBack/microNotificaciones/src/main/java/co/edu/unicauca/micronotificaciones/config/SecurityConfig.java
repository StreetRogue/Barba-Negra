package co.edu.unicauca.micronotificaciones.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // 🟢 Necesario para permitir WebSocket
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // 🟢🔥 Permitir handshake WebSocket
                        .requestMatchers("/ws", "/ws/**").permitAll()

                        // Optional: si tu versión de Spring expone este endpoint de handshake:
                        .requestMatchers("/websocket/**").permitAll()

                        // El resto sí protegido
                        .anyRequest().authenticated()
                )

        // ❗ Solo habilita JWT si REALMENTE usas JWT en este microservicio
        // Si NO usas JWT aquí, comenta esto:
        // .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))

        ;

        return http.build();
    }
}
