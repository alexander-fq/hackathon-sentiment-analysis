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
     * Configuración segura para desarrollo
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Solo orígenes específicos permitidos (sin wildcards)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",  // Frontend React + Vite
            "http://localhost:3000",  // Alternativa React
            "http://localhost:5500",  // Live Server VSCode
            "http://127.0.0.1:5500"   // Live Server VSCode (IP)
        ));

        // Métodos HTTP permitidos (solo los necesarios)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "OPTIONS"));

        // Headers específicos permitidos
        configuration.setAllowedHeaders(Arrays.asList(
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin"
        ));

        // Headers expuestos al cliente
        configuration.setExposedHeaders(Arrays.asList(
            "Content-Type",
            "Authorization"
        ));

        // Permitir credenciales (cookies, auth headers)
        configuration.setAllowCredentials(true);

        // Cache de preflight request (1 hora)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
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
