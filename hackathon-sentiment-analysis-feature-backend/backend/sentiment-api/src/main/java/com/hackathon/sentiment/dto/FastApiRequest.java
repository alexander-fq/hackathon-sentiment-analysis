package com.hackathon.sentiment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO: Request to send to FastAPI ML service
 * Maps to FastAPI endpoint POST /predict
 */
public record FastApiRequest(
    @JsonProperty("text")
    String text,

    @JsonProperty("language")
    String language
) {
    public FastApiRequest(String text, String language) {
        this.text = text;
        this.language = (language == null || language.isEmpty()) ? "es" : language;
    }
}
