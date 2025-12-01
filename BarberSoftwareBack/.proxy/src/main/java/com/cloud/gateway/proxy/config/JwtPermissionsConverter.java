package com.cloud.gateway.proxy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtPermissionsConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private static final String PERMISSIONS_CLAIM = "permissions";
    @Value("${auth0.audience}")
    private String audience;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        String rolesClaim = audience + "/roles";
        Object claim = jwt.getClaims().get(rolesClaim);
        if (claim instanceof Collection<?> col) {
            List<GrantedAuthority> roleAuthorities = col.stream()
                    .map(Object::toString)
                    .map(roleName -> "ROLE_" + roleName.toUpperCase()) // Estandarizamos: ROLE_ADMIN
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            authorities.addAll(roleAuthorities);
        }
        return new JwtAuthenticationToken(jwt, authorities);
    }
}
