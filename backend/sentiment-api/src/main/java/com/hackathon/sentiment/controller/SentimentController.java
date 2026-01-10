package com.hackathon.sentiment.controller;

import com.hackathon.sentiment.dto.SentimentRequest;
import com.hackathon.sentiment.dto.SentimentResponse;
import com.hackathon.sentiment.entity.SentimentAnalysis;
import com.hackathon.sentiment.service.SentimentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Tag(name = "Sentiment Analysis", description = "Operaciones de análisis de sentimiento")
@RestController
@RequestMapping("/api/sentiment")
public class SentimentController {

    private final SentimentService service;

    public SentimentController(SentimentService service) {
        this.service = service;
    }
    @Operation(
            summary = "Analiza el sentimiento de un texto",
            description = "Recibe un texto y opcionalmente el idioma (es/en), retorna la predicción de sentimiento con probabilidades detalladas"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Análisis exitoso"),
            @ApiResponse(responseCode = "400", description = "Request inválido"),
            @ApiResponse(responseCode = "422", description = "Validación fallida"),
            @ApiResponse(responseCode = "503", description = "Servicio ML no disponible")
    })

    @PostMapping
    public SentimentResponse analyzeSentiment(
            @RequestBody @Valid SentimentRequest request
    ) {
        return service.analyze(request.text(), request.language());
    }

    @Operation(
            summary = "Obtiene el historial de predicciones",
            description = "Retorna los últimos 10 análisis de sentimiento realizados, ordenados por fecha de creación descendente"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Historial obtenido exitosamente")
    })
    @GetMapping("/history")
    public List<SentimentAnalysis> getHistory() {
        return service.getHistory();
    }

    @Operation(
            summary = "Obtiene predicciones por tipo de sentimiento",
            description = "Retorna todos los análisis que coincidan con el sentimiento especificado (Positivo, Neutro, Negativo)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Predicciones obtenidas exitosamente")
    })
    @GetMapping("/history/{prediction}")
    public List<SentimentAnalysis> getHistoryByPrediction(@PathVariable String prediction) {
        return service.getHistoryByPrediction(prediction);
    }

    @Operation(
            summary = "Obtiene estadísticas de predicciones",
            description = "Retorna el conteo de predicciones por cada tipo de sentimiento"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estadísticas obtenidas exitosamente")
    })
    @GetMapping("/statistics")
    public Map<String, Long> getStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("Positivo", service.countByPrediction("Positivo"));
        stats.put("Neutro", service.countByPrediction("Neutro"));
        stats.put("Negativo", service.countByPrediction("Negativo"));
        return stats;
    }
}

