package com.sidms.backend.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private String accessSecret;
    private Long accessExpirationMs = 900000L;
    private Long refreshExpirationMs = 2592000000L;
}
