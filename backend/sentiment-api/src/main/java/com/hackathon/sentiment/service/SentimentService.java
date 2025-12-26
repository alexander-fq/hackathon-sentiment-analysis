package com.hackathon.sentiment.service;

import com.hackathon.sentiment.dto.SentimentResponse;
import org.springframework.stereotype.Service;

@Service
public class SentimentService {

    public SentimentResponse analyze(String text) {
        // MOCK temporal – luego irá FastAPI
        return new SentimentResponse("Positivo", 0.95);
    }
}
