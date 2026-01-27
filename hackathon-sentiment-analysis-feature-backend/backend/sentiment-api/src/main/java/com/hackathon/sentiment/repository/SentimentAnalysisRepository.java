package com.hackathon.sentiment.repository;

import com.hackathon.sentiment.entity.SentimentAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository: Data access layer for SentimentAnalysis entity
 * Provides methods to query sentiment analysis records from database
 */
@Repository
public interface SentimentAnalysisRepository extends JpaRepository<SentimentAnalysis, Long> {

    List<SentimentAnalysis> findByPrediction(String prediction);

    Long countByPrediction(String prediction);

    @Query("SELECT AVG(s.probability) FROM SentimentAnalysis s WHERE s.prediction = :prediction")
    Double findAverageProbabilityByPrediction(String prediction);

    List<SentimentAnalysis> findTop10ByOrderByCreatedAtDesc();
}
