package co.edu.unicauca.microUsuarios.integrations;

import co.edu.unicauca.microUsuarios.services.Dtos.BarberoDTOPeticion;
import co.edu.unicauca.microUsuarios.services.Dtos.BarberoDTORespuesta;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class BarberoClient {

    private final WebClient webClient;

    public BarberoClient(WebClient.Builder builder,
            @Value("${clients.barberos.base-url}") String baseUrl) {

        this.webClient = builder
                .baseUrl(baseUrl)
                .build();
    }

    public BarberoDTORespuesta crearBarbero(BarberoDTOPeticion dto) {
        return webClient.post()
                .uri("/api/v1/microBarberos/barberos") // path que usas en Postman
                .bodyValue(dto)
                .retrieve()
                .bodyToMono(BarberoDTORespuesta.class)
                .block();
    }
}
