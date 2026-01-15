package com.hackathon.sentiment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import java.util.Arrays;

/**
 * SecurityConfig para Spring Boot 3.x
 * Configura Spring Security 6 con la nueva sintaxis de SecurityFilterChain
 * 
 * - Permite acceso a archivos estáticos (HTML, CSS, JS)
 * - Permite acceso a la consola de H2
 * - Permite acceso a endpoints de autenticación sin protección
 * - Protege otros endpoints (ready para future implementations)
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    /**
     * Bean de encoder de contraseñas usando BCrypt
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * Configuración de CORS para permitir solicitudes desde el frontend
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:8080", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    /**
     * Configuración de seguridad HTTP
     * Define qué endpoints requieren autenticación y cuáles son públicos
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF para permitir POST sin token (development)
            .csrf(csrf -> csrf.disable())
            
            // Configurar CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configurar autorización de endpoints
            .authorizeHttpRequests(authz -> authz
                // Endpoints públicos - Autenticación
                .requestMatchers(
                    new AntPathRequestMatcher("/api/auth/**")
                ).permitAll()
                
                // Archivos estáticos (HTML, CSS, JS, imágenes)
                .requestMatchers(
                    new AntPathRequestMatcher("/**", "GET"),
                    new AntPathRequestMatcher("/static/**"),
                    new AntPathRequestMatcher("/public/**"),
                    new AntPathRequestMatcher("/index.html"),
                    new AntPathRequestMatcher("/*.html"),
                    new AntPathRequestMatcher("/*.css"),
                    new AntPathRequestMatcher("/*.js")
                ).permitAll()
                
                // Consola de H2 Database
                .requestMatchers(
                    new AntPathRequestMatcher("/h2-console/**")
                ).permitAll()
                
                // Swagger / OpenAPI documentation
                .requestMatchers(
                    new AntPathRequestMatcher("/swagger-ui/**"),
                    new AntPathRequestMatcher("/v3/api-docs/**"),
                    new AntPathRequestMatcher("/swagger-resources/**")
                ).permitAll()
                
                // Health check (actuator si lo agregas en el futuro)
                .requestMatchers(
                    new AntPathRequestMatcher("/actuator/**")
                ).permitAll()
                
                // Endpoints de API públicos (sentiment, stats)
                // Nota: Aquí puedes agregar restricciones en el futuro si es necesario
                .requestMatchers(
                    new AntPathRequestMatcher("/api/sentiment/**"),
                    new AntPathRequestMatcher("/api/stats/**")
                ).permitAll()
                
                // Todos los otros endpoints requieren autenticación
                .anyRequest().authenticated()
            )
            
            // Deshabilitar headers de seguridad específicos para permitir H2 console
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.disable())
            );
        
        return http.build();
    }
}
