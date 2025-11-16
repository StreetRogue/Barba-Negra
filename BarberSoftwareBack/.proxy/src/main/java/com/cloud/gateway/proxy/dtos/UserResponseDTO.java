package com.cloud.gateway.proxy.dtos;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String email;
    private String nombre;
    private String telefono;
    private String role;
}
