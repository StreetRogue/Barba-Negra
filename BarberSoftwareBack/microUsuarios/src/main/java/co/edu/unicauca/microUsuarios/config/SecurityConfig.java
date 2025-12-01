package co.edu.unicauca.microUsuarios.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Stateless, no necesitamos CSRF
                .authorizeHttpRequests(auth -> auth
                        // Puedes dejar abiertas rutas de Swagger o Actuator si las usas
                        // .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers("/api/v1/usuarios/buscar").permitAll()
                        .requestMatchers("/api/v1/usuarios/{id}").permitAll()
                        .requestMatchers("/ws", "/ws/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}));

        return http.build();
    }

}

