package co.edu.unicauca.microreservas.infra;

import co.edu.unicauca.microreservas.fachadaServices.DTO.BarberoServicioDTO;
import co.edu.unicauca.microreservas.fachadaServices.DTO.HorarioExternoDTO;
import co.edu.unicauca.microreservas.fachadaServices.DTO.ServicioExternoDTO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;

@Component
public class BarberoClient {

    private final WebClient webClient;

     public BarberoClient(WebClient.Builder builder,
                         @Value("${clients.barberos.base-url}") String baseUrl) {
        this.webClient = builder
                .baseUrl(baseUrl)
                .build();
    }

    /**
     * Consulta la info del servicio por ID.
     * Ruta: localhost:5001/api/v1/microBarberos/servicios/{id}
     */
    public ServicioExternoDTO obtenerServicio(Integer idServicio) {
        return webClient.get()
                .uri("/servicios/" + idServicio)
                .retrieve()
                .bodyToMono(ServicioExternoDTO.class) // Esperamos un solo objeto
                .block(); // Bloqueamos para obtener el resultado síncrono
    }

    /**
     * Consulta TODOS los horarios de un barbero.
     * Ruta: localhost:5001/api/v1/microBarberos/barbero/{id}/horarios
     * Nota: Como la URL devuelve una lista (todos los días), usamos bodyToFlux o collectList.
     */
    public List<HorarioExternoDTO> obtenerHorarios(Integer idBarbero) {
        return webClient.get()
                .uri("/barbero/" + idBarbero + "/horarios")
                .retrieve()
                .bodyToFlux(HorarioExternoDTO.class) // Esperamos una lista (Flux)
                .collectList()
                .block();
    }

    /**
     * NUEVO: Obtiene la lista de servicios que un barbero específico puede realizar.
     * Ruta asumida: GET /api/v1/microBarberos/barberoServicio/barbero/{idBarbero}
     */
    public List<BarberoServicioDTO> obtenerServiciosPorBarbero(Integer idBarbero) {
        try {
            return webClient.get()
                    .uri("/barberoServicio/barbero/" + idBarbero)
                    .retrieve()
                    .bodyToFlux(BarberoServicioDTO.class)
                    .collectList()
                    .block();
        } catch (WebClientResponseException e) {
            return Collections.emptyList();
        }
    }
}
