package com.hackathon.sentiment.controller;

import com.hackathon.sentiment.dto.SentimentRequest;
import com.hackathon.sentiment.dto.SentimentResponse;
import com.hackathon.sentiment.service.SentimentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

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
            description = "Recibe un texto y retorna la predicción de sentimiento con su probabilidad"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Análisis exitoso"),
            @ApiResponse(responseCode = "400", description = "Request inválido"),
            @ApiResponse(responseCode = "405", description = "Método no permitido")
    })

    @PostMapping
    public SentimentResponse analyzeSentiment(
            @RequestBody @Valid SentimentRequest request
    ) {
        return service.analyze(request.text());
    }
}

