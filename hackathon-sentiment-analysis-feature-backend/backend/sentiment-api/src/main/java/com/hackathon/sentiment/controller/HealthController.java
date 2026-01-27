package com.hackathon.sentiment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller: Health check endpoint
 * Monitors application health and ML service connectivity
 */
@Tag(name = "Health", description = "System health monitoring")
@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final WebClient webClient;
    private final LocalDateTime startTime;

    public HealthController(WebClient mlServiceWebClient) {
        this.webClient = mlServiceWebClient;
        this.startTime = LocalDateTime.now();
    }

    @Operation(
            summary = "Check system health",
            description = "Returns health status of the application and ML service connectivity"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "System healthy"),
            @ApiResponse(responseCode = "503", description = "System degraded (ML service unavailable)")
    })
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();

        boolean mlServiceConnected = checkMlServiceConnection();

        String status = mlServiceConnected ? "UP" : "DEGRADED";

        health.put("status", status);
        health.put("mlServiceStatus", mlServiceConnected ? "connected" : "disconnected");
        health.put("uptime", calculateUptime());
        health.put("timestamp", LocalDateTime.now());

        HttpStatus httpStatus = mlServiceConnected ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;

        return ResponseEntity.status(httpStatus).body(health);
    }

    private boolean checkMlServiceConnection() {
        try {
            webClient.get()
                    .uri("/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(2))
                    .block();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String calculateUptime() {
        long hours = ChronoUnit.HOURS.between(startTime, LocalDateTime.now());
        long minutes = ChronoUnit.MINUTES.between(startTime, LocalDateTime.now()) % 60;
        long seconds = ChronoUnit.SECONDS.between(startTime, LocalDateTime.now()) % 60;

        if (hours > 0) {
            return hours + "h " + minutes + "m";
        } else if (minutes > 0) {
            return minutes + "m " + seconds + "s";
        } else {
            return seconds + "s";
        }
    }
}
