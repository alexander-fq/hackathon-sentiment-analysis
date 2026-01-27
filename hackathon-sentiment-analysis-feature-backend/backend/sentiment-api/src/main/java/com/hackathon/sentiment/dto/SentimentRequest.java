package com.hackathon.sentiment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public record SentimentRequest(

        @NotBlank(message = "El texto no puede estar vacío")
        @Size(min = 5, max = 5000, message = "El texto debe tener entre 5 y 5000 caracteres")
        String text,

        @Pattern(regexp = "es|en", message = "El idioma debe ser 'es' o 'en'")
        String language

) {
    public SentimentRequest(String text, String language) {
        this.text = text;
        this.language = (language == null || language.isEmpty()) ? "es" : language;
    }
}
