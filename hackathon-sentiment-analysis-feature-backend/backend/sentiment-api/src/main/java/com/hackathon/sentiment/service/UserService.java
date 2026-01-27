package com.hackathon.sentiment.service;

import com.hackathon.sentiment.dto.AuthRequest;
import com.hackathon.sentiment.dto.AuthResponse;
import com.hackathon.sentiment.entity.User;
import com.hackathon.sentiment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    
    /**
     * Registra un nuevo usuario en el sistema
     */
    public AuthResponse register(AuthRequest request) {
        // Validar que username y email no estén vacíos
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return new AuthResponse(false, "El nombre de usuario es requerido", null, null, null);
        }
        
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse(false, "El email es requerido", null, null, null);
        }
        
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return new AuthResponse(false, "La contraseña es requerida", null, null, null);
        }
        
        // Verificar que no existe usuario con ese username
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(false, "El nombre de usuario ya existe", null, null, null);
        }
        
        // Verificar que no existe usuario con ese email
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "El email ya está registrado", null, null, null);
        }
        
        // Crear nuevo usuario
        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        User savedUser = userRepository.save(user);
        
        // Generar un token simple (Base64 del username:password)
        String token = generateSimpleToken(savedUser.getUsername(), savedUser.getId());
        
        return new AuthResponse(
            true,
            "Usuario registrado exitosamente",
            token,
            savedUser.getId(),
            savedUser.getUsername()
        );
    }
    
    /**
     * Autentica un usuario y devuelve un token
     */
    public AuthResponse login(AuthRequest request) {
        // Validar credenciales
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return new AuthResponse(false, "El nombre de usuario es requerido", null, null, null);
        }
        
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return new AuthResponse(false, "La contraseña es requerida", null, null, null);
        }
        
        // Buscar usuario por username
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername().trim());
        
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "Usuario o contraseña inválidos", null, null, null);
        }
        
        User user = userOpt.get();
        
        // Validar contraseña
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(false, "Usuario o contraseña inválidos", null, null, null);
        }
        
        // Generar token
        String token = generateSimpleToken(user.getUsername(), user.getId());
        
        return new AuthResponse(
            true,
            "Autenticación exitosa",
            token,
            user.getId(),
            user.getUsername()
        );
    }
    
    /**
     * Genera un token simple basado en username e id
     * Formato: Base64(username:id:timestamp)
     */
    private String generateSimpleToken(String username, Long userId) {
        long timestamp = System.currentTimeMillis();
        String tokenData = username + ":" + userId + ":" + timestamp;
        return Base64.getEncoder().encodeToString(tokenData.getBytes());
    }
    
    /**
     * Obtiene un usuario por ID
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * Obtiene un usuario por username
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
