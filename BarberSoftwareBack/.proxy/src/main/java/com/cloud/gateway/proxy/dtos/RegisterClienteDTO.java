package com.cloud.gateway.proxy.dtos;

import lombok.Data;

@Data
public class RegisterClienteDTO {
    private String nombre;
    private String email;
    // No incluimos password ni telefono porque no los necesitamos en este flujo
}
