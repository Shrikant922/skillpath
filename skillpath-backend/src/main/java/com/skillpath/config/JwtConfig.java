package com.skillpath.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // TODO: Add JWT generation and validation methods
    // generateToken(username) → String
    // validateToken(token)    → boolean
    // getUsername(token)      → String
}
