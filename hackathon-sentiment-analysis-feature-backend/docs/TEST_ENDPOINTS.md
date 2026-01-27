# TEST PLAN - Sentiment API Endpoints

## Test Date: 2025-12-31
## Tester: Backend Team

---

## PREREQUISITES

1. Backend running on port 8080
   ```bash
   cd backend/sentiment-api
   mvn spring-boot:run
   ```

2. FastAPI running on port 8000 (optional for some tests)
   ```bash
   cd data-science/api
   uvicorn main:app --reload --port 8000
   ```

---

## TEST 1: Health Check Endpoint

### Test Case: Health check when FastAPI is DOWN
**Endpoint:** `GET http://localhost:8080/api/health`

**Expected Response:**
```json
{
  "status": "DEGRADED",
  "mlServiceStatus": "disconnected",
  "uptime": "5s",
  "timestamp": "2025-12-31T10:00:00"
}
```

**HTTP Status:** 503 Service Unavailable

**cURL Command:**
```bash
curl -X GET http://localhost:8080/api/health -w "\nHTTP Status: %{http_code}\n"
```

**Result:** [ ] PASS  [ ] FAIL

**Notes:**
```
_______________________________________


```

---

### Test Case: Health check when FastAPI is UP
**Endpoint:** `GET http://localhost:8080/api/health`

**Expected Response:**
```json
{
  "status": "UP",
  "mlServiceStatus": "connected",
  "uptime": "2m 30s",
  "timestamp": "2025-12-31T10:02:30"
}
```

**HTTP Status:** 200 OK

**cURL Command:**
```bash
curl -X GET http://localhost:8080/api/health -w "\nHTTP Status: %{http_code}\n"
```

**Result:** [ ] PASS  [ ] FAIL

**Notes:**
```
_______________________________________


```

---

## TEST 2: Stats Endpoint (Empty Database)

### Test Case: Get stats with no predictions
**Endpoint:** `GET http://localhost:8080/api/stats`

**Expected Response:**
```json
{
  "total": 0,
  "positiveCount": 0,
  "negativeCount": 0,
  "neutralCount": 0,
  "positivePercentage": 0.0,
  "negativePercentage": 0.0,
  "neutralPercentage": 0.0,
  "averageProbabilityPositive": 0.0,
  "averageProbabilityNegative": 0.0,
  "averageProbabilityNeutral": 0.0
}
```

**HTTP Status:** 200 OK

**cURL Command:**
```bash
curl -X GET http://localhost:8080/api/stats
```

**Result:** [ ] PASS  [ ] FAIL

**Notes:**
```
_______________________________________


```

---

## TEST 3: Sentiment Analysis (requires FastAPI)

### Test Case: Analyze positive text
**Endpoint:** `POST http://localhost:8080/api/sentiment`

**Request Body:**
```json
{
  "text": "Me encanta este producto, es excelente"
}
```

**Expected Response:**
```json
{
  "prediction": "Positivo",
  "probability": 0.XX
}
```

**HTTP Status:** 200 OK

**cURL Command:**
```bash
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"Me encanta este producto, es excelente"}'
```

**Result:** [ ] PASS  [ ] FAIL

**Notes:**
```
_______________________________________


```

---

### Test Case: Analyze negative text
**Endpoint:** `POST http://localhost:8080/api/sentiment`

**Request Body:**
```json
{
  "text": "Pésimo servicio, nunca más vuelvo"
}
```

**Expected Response:**
```json
{
  "prediction": "Negativo",
  "probability": 0.XX
}
```

**HTTP Status:** 200 OK

**cURL Command:**
```bash
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"Pésimo servicio, nunca más vuelvo"}'
```

**Result:** [ ] PASS  [ ] FAIL

**Notes:**
```
_______________________________________


```

---

### Test Case: Invalid request (empty text)
**Endpoint:** `POST http://localhost:8080/api/sentiment`

**Request Body:**
```json
{
  "text": ""
}
```

**Expected Response:**
```json
{
  "timestamp": "...",
  "status": 400,
  "error": "Validation Error",
  "errors": {
    "text": "El texto no puede estar vacío"
  }
}
```

**HTTP Status:** 400 Bad Request

**cURL Command:**
```bash
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":""}'
```

**Result:** [ ] PASS  [ ] FAIL

**Notes:**
```
_______________________________________


```

---

## TEST 4: Stats After Predictions

### Test Case: Verify stats update after predictions
**Endpoint:** `GET http://localhost:8080/api/stats`

**Prerequisites:**
- Execute TEST 3 (2 predictions made)

**Expected Response:**
```json
{
  "total": 2,
  "positiveCount": 1,
  "negativeCount": 1,
  "neutralCount": 0,
  "positivePercentage": 50.0,
  "negativePercentage": 50.0,
  "neutralPercentage": 0.0,
  "averageProbabilityPositive": 0.XX,
  "averageProbabilityNegative": 0.XX,
  "averageProbabilityNeutral": 0.0
}
```

**HTTP Status:** 200 OK

**cURL Command:**
```bash
curl -X GET http://localhost:8080/api/stats
```

**Result:** [ ] PASS  [ ] FAIL

**Notes:**
```
_______________________________________


```

---

## TEST 5: Database Verification

### Test Case: Check H2 Console
**URL:** `http://localhost:8080/h2-console`

**JDBC URL:** `jdbc:h2:mem:sentimentdb`
**Username:** `sa`
**Password:** (empty)

**SQL Query:**
```sql
SELECT * FROM sentiment_analysis;
```

**Expected:**
- Table exists
- Contains records from previous tests
- Columns: id, text, prediction, probability, created_at

**Result:** [ ] PASS  [ ] FAIL

**Notes:**
```
_______________________________________


```

---

## SUMMARY

| Test | Status | Notes |
|------|--------|-------|
| Health Check (DOWN) | [ ] | |
| Health Check (UP) | [ ] | |
| Stats (Empty) | [ ] | |
| Sentiment (Positive) | [ ] | |
| Sentiment (Negative) | [ ] | |
| Validation (Empty) | [ ] | |
| Stats (After) | [ ] | |
| Database | [ ] | |

**Total Tests:** 8
**Passed:** ___
**Failed:** ___
**Pass Rate:** ___%

---

## ERRORS LOG

```
Record any errors or unexpected behavior here:






```

---

## RECOMMENDATIONS

```
Improvements or changes needed:






```
