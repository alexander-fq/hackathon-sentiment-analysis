package com.hackathon.sentiment.controller;

import com.hackathon.sentiment.model.Sentiment;
import com.hackathon.sentiment.service.SentimentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sentiment")
@CrossOrigin(origins = "http://localhost:3000")
public class SentimentController {

    private final SentimentService sentimentService;

    public SentimentController(SentimentService sentimentService) {
        this.sentimentService = sentimentService;
    }

    @PostMapping
    public ResponseEntity<Sentiment> analyze(@RequestBody SentimentRequest request) {

        // 🔹 MOCK (temporal)
        String prediction = "Positivo";
        double probability = 0.92;

        Sentiment sentiment = new Sentiment();
        sentiment.setText(request.text());
        sentiment.setPrediction(prediction);
        sentiment.setProbability(probability);

        Sentiment saved = sentimentService.save(sentiment);

        return ResponseEntity.ok(saved);
    }

    // Endpoint extra para validar DB
    @GetMapping
    public ResponseEntity<?> list() {
        return ResponseEntity.ok(sentimentService.findAll());
    }
}
