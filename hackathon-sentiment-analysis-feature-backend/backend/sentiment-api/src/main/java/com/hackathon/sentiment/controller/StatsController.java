package com.hackathon.sentiment.controller;

import com.hackathon.sentiment.repository.SentimentAnalysisRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller: Statistics endpoint
 * Provides aggregated statistics about sentiment analysis predictions
 */
@Tag(name = "Statistics", description = "Sentiment analysis statistics and metrics")
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final SentimentAnalysisRepository repository;

    public StatsController(SentimentAnalysisRepository repository) {
        this.repository = repository;
    }

    @Operation(
            summary = "Get sentiment analysis statistics",
            description = "Returns aggregated statistics including total count, distribution by sentiment, and average probabilities"
    )
    @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    @GetMapping
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();

        long total = repository.count();
        stats.put("total", total);

        long positiveCount = repository.countByPrediction("Positivo");
        long negativeCount = repository.countByPrediction("Negativo");
        long neutralCount = repository.countByPrediction("Neutro");

        stats.put("positiveCount", positiveCount);
        stats.put("negativeCount", negativeCount);
        stats.put("neutralCount", neutralCount);

        if (total > 0) {
            stats.put("positivePercentage", (positiveCount * 100.0) / total);
            stats.put("negativePercentage", (negativeCount * 100.0) / total);
            stats.put("neutralPercentage", (neutralCount * 100.0) / total);
        } else {
            stats.put("positivePercentage", 0.0);
            stats.put("negativePercentage", 0.0);
            stats.put("neutralPercentage", 0.0);
        }

        Double avgProbPositive = repository.findAverageProbabilityByPrediction("Positivo");
        Double avgProbNegative = repository.findAverageProbabilityByPrediction("Negativo");
        Double avgProbNeutral = repository.findAverageProbabilityByPrediction("Neutro");

        stats.put("averageProbabilityPositive", avgProbPositive != null ? avgProbPositive : 0.0);
        stats.put("averageProbabilityNegative", avgProbNegative != null ? avgProbNegative : 0.0);
        stats.put("averageProbabilityNeutral", avgProbNeutral != null ? avgProbNeutral : 0.0);

        return stats;
    }
}
