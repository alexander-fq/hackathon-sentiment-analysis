package com.hackathon.sentiment.service;

import com.hackathon.sentiment.model.Sentiment;
import com.hackathon.sentiment.repository.SentimentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SentimentService {

    private final SentimentRepository sentimentRepository;

    public SentimentService(SentimentRepository sentimentRepository) {
        this.sentimentRepository = sentimentRepository;
    }

    // Guardar un análisis
    public Sentiment save(Sentiment sentiment) {
        return sentimentRepository.save(sentiment);
    }

    // Obtener todos los análisis (útil para pruebas / stats)
    public List<Sentiment> findAll() {
        return sentimentRepository.findAll();
    }
}
