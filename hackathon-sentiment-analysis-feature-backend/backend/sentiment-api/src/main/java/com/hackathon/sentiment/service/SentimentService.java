package com.hackathon.sentiment.service;

import com.hackathon.sentiment.dto.FastApiRequest;
import com.hackathon.sentiment.dto.FastApiResponse;
import com.hackathon.sentiment.dto.SentimentResponse;
import com.hackathon.sentiment.entity.SentimentAnalysis;
import com.hackathon.sentiment.repository.SentimentAnalysisRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;

/**
 * Service: Sentiment analysis business logic
 * Integrates with FastAPI ML service for predictions and persists results
 */
@Service
public class SentimentService {

    private final WebClient webClient;
    private final String predictEndpoint;
    private final SentimentAnalysisRepository repository;

    public SentimentService(WebClient mlServiceWebClient,
                           @Value("${ml.service.predict-endpoint}") String predictEndpoint,
                           SentimentAnalysisRepository repository) {
        this.webClient = mlServiceWebClient;
        this.predictEndpoint = predictEndpoint;
        this.repository = repository;
    }

    public SentimentResponse analyze(String text, String language) {
        // Create request for FastAPI with language parameter
        FastApiRequest request = new FastApiRequest(text, language);

        // Call FastAPI ML service
        FastApiResponse response = webClient.post()
                .uri(predictEndpoint)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(FastApiResponse.class)
                .block();

        // Handle null response
        if (response == null) {
            throw new RuntimeException("No response received from ML service");
        }

        // Persist prediction to database
        SentimentAnalysis entity = new SentimentAnalysis(
                text,
                response.prevision(),
                response.probabilidad()
        );
        repository.save(entity);

        // Map FastAPI response to SentimentResponse with all fields
        return new SentimentResponse(
                response.prevision(),
                response.probabilidad(),
                response.probabilidadesDetalle(),
                response.idioma(),
                response.timestamp()
        );
    }

    public List<SentimentAnalysis> getHistory() {
        return repository.findTop10ByOrderByCreatedAtDesc();
    }

    public List<SentimentAnalysis> getHistoryByPrediction(String prediction) {
        return repository.findByPrediction(prediction);
    }

    public Long countByPrediction(String prediction) {
        return repository.countByPrediction(prediction);
    }
}
