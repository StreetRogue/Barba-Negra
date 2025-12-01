package co.edu.unicauca.microreservas.infra;

import co.edu.unicauca.microreservas.fachadaServices.DTO.UsuarioExternoDTO;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Component
public class UsuarioClient {

    private final WebClient webClient;

    public UsuarioClient(WebClient.Builder builder,
                         @Value("${clients.usuarios.base-url}") String baseUrl) {
        this.webClient = builder
                .baseUrl(baseUrl)
                .build();
    }

    public UsuarioExternoDTO buscarPorEmail(String email) {
        try {
            return webClient.get()
                    // Asumiendo que tienes este endpoint en microUsuarios: GET /buscar?email=...
                    // O GET /email/{email}
                    .uri(uriBuilder -> uriBuilder
                            .path("/buscar")
                            .queryParam("email", email)
                            .build())
                    .retrieve()
                    .bodyToMono(UsuarioExternoDTO.class)
                    .block();
        } catch (Exception e) {
            System.err.println("Error buscando usuario por email: " + e.getMessage());
            return null;
        }
    }


}
