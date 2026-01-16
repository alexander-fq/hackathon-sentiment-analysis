package com.hackathon.sentiment.repository;

import com.hackathon.sentiment.model.Sentiment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SentimentRepository extends JpaRepository<Sentiment, Long> {
}
