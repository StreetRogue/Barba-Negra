package co.edu.unicauca.micronotificaciones.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class MicroservicesConfig {

    // Define un bean RestTemplate para hacer llamadas HTTP a otros microservicios
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
