package com.hackathon.sentiment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

/**
 * DTO: Response received from FastAPI ML service
 * Maps fields from Spanish (FastAPI) to Java variables
 */
public record FastApiResponse(

    @JsonProperty("prevision")
    String prevision,

    @JsonProperty("probabilidad")
    Double probabilidad,

    @JsonProperty("probabilidades_detalle")
    Map<String, Double> probabilidadesDetalle,

    @JsonProperty("idioma")
    String idioma,

    @JsonProperty("timestamp")
    String timestamp
) {}
