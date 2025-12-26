package com.hackathon.sentiment.dto;

public class SentimentResponse {

    private String prediction;
    private double probability;

    public SentimentResponse(String prediction, double probability) {
        this.prediction = prediction;
        this.probability = probability;
    }

    public String getPrediction() {
        return prediction;
    }

    public double getProbability() {
        return probability;
    }
}
