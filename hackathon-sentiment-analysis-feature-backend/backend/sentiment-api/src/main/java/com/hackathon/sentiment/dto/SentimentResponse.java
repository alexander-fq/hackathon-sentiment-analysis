package com.hackathon.sentiment.dto;

import java.util.Map;

public class SentimentResponse {

    private String prediction;
    private double probability;
    private Map<String, Double> probabilitiesDetail;
    private String language;
    private String timestamp;

    public SentimentResponse(String prediction, double probability, Map<String, Double> probabilitiesDetail,
                           String language, String timestamp) {
        this.prediction = prediction;
        this.probability = probability;
        this.probabilitiesDetail = probabilitiesDetail;
        this.language = language;
        this.timestamp = timestamp;
    }

    public String getPrediction() {
        return prediction;
    }

    public double getProbability() {
        return probability;
    }

    public Map<String, Double> getProbabilitiesDetail() {
        return probabilitiesDetail;
    }

    public String getLanguage() {
        return language;
    }

    public String getTimestamp() {
        return timestamp;
    }
}
