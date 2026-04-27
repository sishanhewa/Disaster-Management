package com.sidms.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> 
                            response.sendError(401, "Unauthorized")
                        )
                        .accessDeniedHandler((request, response, accessDeniedException) -> 
                            response.sendError(403, "Forbidden")
                        )
                )
                .authorizeHttpRequests(auth -> auth
                        // Public auth endpoints
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/refresh").permitAll()

                        // Public read-only endpoints
                        .requestMatchers(HttpMethod.GET, "/api/v1/weather/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/disasters/warnings/active").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/reports/public").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/flood/dashboard").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/guides/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/faq/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/map/custom-zones").permitAll()

                        // Relief camp domain (ported from Disaster-Management-master — Step 3)
                        .requestMatchers(HttpMethod.GET,    "/api/v1/camps/**").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/v1/needs/**").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/v1/collection-points/**").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/v1/incidents/**").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/v1/broadcast-alerts/active").permitAll()
                        // Donors can pledge anonymously or as authenticated users
                        .requestMatchers(HttpMethod.POST,   "/api/v1/pledges/**").permitAll()
                        // Camp managers (responders) manage camps, needs, incidents
                        .requestMatchers(HttpMethod.POST,   "/api/v1/camps/**").hasAnyRole("ADMIN", "RESPONDER")
                        .requestMatchers(HttpMethod.PUT,    "/api/v1/camps/**").hasAnyRole("ADMIN", "RESPONDER")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/camps/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,   "/api/v1/needs/**").hasAnyRole("ADMIN", "RESPONDER")
                        .requestMatchers(HttpMethod.PUT,    "/api/v1/needs/**").hasAnyRole("ADMIN", "RESPONDER")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/needs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/v1/pledges/**").hasAnyRole("ADMIN", "RESPONDER")
                        .requestMatchers(HttpMethod.POST,   "/api/v1/incidents/**").hasAnyRole("ADMIN", "RESPONDER")
                        .requestMatchers(HttpMethod.PUT,    "/api/v1/incidents/**").hasAnyRole("ADMIN", "RESPONDER")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/incidents/**").hasRole("ADMIN")
                        .requestMatchers(          "/api/v1/broadcast-alerts/**").hasRole("ADMIN")
                        .requestMatchers(          "/api/v1/collection-points/**").hasAnyRole("ADMIN", "RESPONDER")

                        // Actuator
                        .requestMatchers(HttpMethod.GET, "/actuator/health").permitAll()

                        // Admin endpoints
                        .requestMatchers("/api/v1/admin/emergency/**").hasAnyRole("ADMIN", "RESPONDER", "GOVT_OFFICIAL")
                        .requestMatchers("/api/v1/admin/sos/**").hasAnyRole("ADMIN", "RESPONDER", "GOVT_OFFICIAL")
                        .requestMatchers("/api/v1/admin/warnings/**").hasAnyRole("ADMIN", "RESPONDER", "GOVT_OFFICIAL")
                        .requestMatchers("/api/v1/admin/spatial-units/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/weather-nodes/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://climasphere.onrender.com"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
