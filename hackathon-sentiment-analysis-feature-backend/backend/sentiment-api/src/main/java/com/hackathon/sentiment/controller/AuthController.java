package com.hackathon.sentiment.controller;

import com.hackathon.sentiment.dto.AuthRequest;
import com.hackathon.sentiment.dto.AuthResponse;
import com.hackathon.sentiment.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    /**
     * POST /api/auth/register
     * Registra un nuevo usuario en el sistema
     * 
     * Ejemplo de request:
     * {
     *   "username": "carlos",
     *   "email": "carlos@example.com",
     *   "password": "miContraseña123"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        AuthResponse response = userService.register(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    /**
     * POST /api/auth/login
     * Autentica un usuario y devuelve un token
     * 
     * Ejemplo de request:
     * {
     *   "username": "carlos",
     *   "password": "miContraseña123"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = userService.login(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    /**
     * GET /api/auth/health
     * Endpoint para verificar que el servicio de autenticación está activo
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is running");
    }
}
