package com.cloud.gateway.proxy.controllers;

import com.cloud.gateway.proxy.dtos.LoginRequestDTO;
import com.cloud.gateway.proxy.dtos.LoginResponseDTO;
import com.cloud.gateway.proxy.dtos.RegisterClienteDTO;
import com.cloud.gateway.proxy.dtos.UserResponseDTO;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@RestController
public class AuthController {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private final WebClient webClient;

    public AuthController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:5000").build();
    }

    @GetMapping("/login/success")
    public Mono<Void> handleLoginSuccess(@AuthenticationPrincipal OAuth2User oauth2User, ServerWebExchange exchange) {
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        RegisterClienteDTO registrationData = new RegisterClienteDTO();
        registrationData.setNombre(name);
        registrationData.setEmail(email);

        return this.webClient.post().uri("/api/v1/usuarios/registro-google")
                .bodyValue(registrationData)
                .retrieve()
                .bodyToMono(UserResponseDTO.class)
                .flatMap(userInfo -> {
                    String jwt = generateJwtToken(userInfo);
                    String redirectUrl = "http://localhost:4200/login/callback?token=" + jwt;
                    ServerHttpResponse response = exchange.getResponse();
                    response.setStatusCode(HttpStatus.OK);
                    response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
                    String jsonResponse = "{\"token\":\"" + jwt + "\"}";

                    return response.writeWith(
                            Mono.just(response.bufferFactory().wrap(jsonResponse.getBytes()))
                    );

                    //response.setStatusCode(HttpStatus.FOUND);
                    //response.getHeaders().setLocation(URI.create(redirectUrl));
                    //return response.setComplete();
                })
                .onErrorResume(e -> {
                    ServerHttpResponse response = exchange.getResponse();
                    response.setStatusCode(HttpStatus.FOUND);
                    response.getHeaders().setLocation(URI.create("http://localhost:4200/auth/error"));
                    return response.setComplete();
                });
    }

    // Metodo para login local
    @PostMapping("/api/v1/usuarios/login")
    public Mono<ResponseEntity<LoginResponseDTO>> handleLocalLogin(@RequestBody LoginRequestDTO loginRequest) {

        // 1. Llama al endpoint de login del microUsuario para validar credenciales
        return this.webClient
                .post()
                .uri("/api/v1/usuarios/login") // Endpoint de validación en microUsuario
                .bodyValue(loginRequest)
                .retrieve()
                .bodyToMono(UserResponseDTO.class) // Esperamos los datos del usuario si es exitoso
                .map(userInfoFromMicroservice -> {
                    // 2. Si es exitoso, el Gateway genera el JWT
                    String jwt = generateJwtToken(userInfoFromMicroservice);
                    LoginResponseDTO response = new LoginResponseDTO(jwt);

                    // 3. Devuelve 200 OK con el token
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(WebClientResponseException.class, ex -> {
                    // 4. Si el microUsuario devuelve un error (401, 404), lo reenviamos al cliente
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).build());
                });
    }

    private String generateJwtToken(UserResponseDTO userInfo) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        long now = System.currentTimeMillis();
        Date validity = new Date(now + 3600 * 1000 * 24); // 24 horas de validez

        return Jwts.builder()
                .subject(userInfo.getEmail())
                .claim("nombre", userInfo.getNombre())
                .claim("rol", userInfo.getRole())
                .issuedAt(new Date(now))
                .expiration(validity)
                .signWith(key)
                .compact();
    }
}
