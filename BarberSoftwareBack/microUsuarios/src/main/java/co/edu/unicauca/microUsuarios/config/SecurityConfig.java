package co.edu.unicauca.microUsuarios.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Desactivar seguridad mientras probamos el microservicio
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable()) // evitar bloqueo por CSRF
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // permitir TODO
                )
                .httpBasic(httpBasic -> httpBasic.disable()) // desactivar basic auth
                .formLogin(form -> form.disable()); // desactivar form login

        return http.build();
    }
}

