package com.hackathon.sentiment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SentimentRequest(

        @NotBlank(message = "El texto no puede estar vacío")
        @Size(min = 3, message = "El texto debe tener al menos 3 caracteres")
        String text

) {}
