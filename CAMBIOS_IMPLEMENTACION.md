# Cambios de Implementación - Sistema de Análisis de Sentimientos

**Fecha:** 2026-01-10
**Rama:** main
**Versión:** 2.0.0

---

## Índice
1. [Resumen ](#resumen)
2. [Modelos de Machine Learning](#modelos-de-machine-learning)
3. [Cambios en FastAPI](#cambios-en-fastapi)
4. [Cambios en Backend Spring Boot](#cambios-en-backend-spring-boot)
5. [Nuevos Endpoints](#nuevos-endpoints)
6. [Configuración](#configuración)
7. [Testing Realizado](#testing-realizado)
8. [Pendientes](#pendientes)

---

## Resumen 

Se implementó un sistema completo de análisis de sentimientos con soporte para **2 idiomas** (español e inglés) y **3 clases de sentimiento** (Positivo, Neutro, Negativo), incluyendo:

-  Integración de modelos ML entrenados (.pkl)
-  API FastAPI con validaciones y logging
-  Backend Spring Boot con endpoints REST
-  Base de datos H2 para historial
-  Endpoints GET para consultar historial y estadísticas
-  Documentación Swagger/OpenAPI

---

## Modelos de Machine Learning

### Archivos Agregados

Los modelos entrenados fueron movidos a la ubicación correcta:

```
data-science/models/
├── pipeline_sentimientos_español.pkl     (307 KB)
├── pipeline_sentimientos_ingles.pkl      (304 KB)
├── modelo_sentimientos_español.pkl       (21 MB)
├── modelo_sentimientos_ingles.pkl        (280 KB)
├── tfidf_vectorizador_español.pkl        (26 MB)
└── tfidf_vectorizador_ingles.pkl         (276 KB)
```

### Estructura de los Modelos

Los modelos son **pipelines de scikit-learn** que incluyen:
1. Preprocesamiento de texto
2. Vectorización TF-IDF
3. Clasificador Logistic Regression

**Clases de salida:** `['Negativo', 'Neutro', 'Positivo']`

---

## Cambios en FastAPI

### Archivo: `data-science/api/main.py`

**Cambios principales:**

#### 1. Importaciones y Configuración
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict
import joblib
import os
from datetime import datetime
import logging
```

#### 2. Modelos de Datos Pydantic

**SentimentRequest:**
```python
class SentimentRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=5000, description="Texto a analizar")
    language: str = Field(default="es", pattern="^(es|en)$", description="Idioma del texto")

    @validator('text')
    def validate_text(cls, v):
        v = v.strip()
        if len(v) < 5:
            raise ValueError('El texto debe tener al menos 5 caracteres')
        if not any(c.isalnum() for c in v):
            raise ValueError('El texto debe contener al menos una letra o número')
        return v
```

**SentimentResponse:**
```python
class SentimentResponse(BaseModel):
    prevision: str
    probabilidad: float
    probabilidades_detalle: Dict[str, float]
    idioma: str
    timestamp: str
```

#### 3. Carga de Modelos al Inicio

```python
@app.on_event("startup")
async def load_models():
    global pipeline_es, pipeline_en
    base_path = "../models"

    # Cargar pipeline español
    pipeline_es_path = os.path.join(base_path, "pipeline_sentimientos_español.pkl")
    pipeline_es = joblib.load(pipeline_es_path)
    logger.info(f"Pipeline español cargado: {len(pipeline_es.classes_)} clases")

    # Cargar pipeline inglés
    pipeline_en_path = os.path.join(base_path, "pipeline_sentimientos_ingles.pkl")
    pipeline_en = joblib.load(pipeline_en_path)
    logger.info(f"Pipeline inglés cargado: {len(pipeline_en.classes_)} clases")
```

#### 4. Endpoint de Predicción

```python
@app.post("/predict", response_model=SentimentResponse)
async def predict(request: SentimentRequest):
    # Seleccionar pipeline según idioma
    pipeline = pipeline_es if request.language == "es" else pipeline_en

    # Realizar predicción
    prediction = pipeline.predict([request.text])[0]
    probabilities = pipeline.predict_proba([request.text])[0]

    # Calcular probabilidad de la clase predicha
    class_idx = list(pipeline.classes_).index(prediction)
    probability = float(probabilities[class_idx])

    # Probabilidades detalladas de todas las clases
    prob_detail = {
        str(clase): round(float(prob), 4)
        for clase, prob in zip(pipeline.classes_, probabilities)
    }

    return SentimentResponse(
        prevision=str(prediction),
        probabilidad=round(probability, 4),
        probabilidades_detalle=prob_detail,
        idioma=request.language,
        timestamp=datetime.now().isoformat()
    )
```

#### 5. Endpoint de Health Check

```python
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "models": {
            "spanish": pipeline_es is not None,
            "english": pipeline_en is not None
        },
        "timestamp": datetime.now().isoformat()
    }
```

**Cambios clave:**
-  Soporte para 2 idiomas (español/inglés)
-  Validación de texto (min 5, max 5000 caracteres)
-  Validación de idioma con regex pattern
-  Probabilidades detalladas de las 3 clases
-  Logging de predicciones
-  Health check endpoint
-  Manejo de errores con códigos HTTP apropiados

**Nota técnica:** Se cambió `regex` a `pattern` en Pydantic Field debido a actualización de Pydantic v2.

---

## Cambios en Backend Spring Boot

### 1. DTOs Actualizados

#### `FastApiRequest.java`
```java
public record FastApiRequest(
    @JsonProperty("text")
    String text,

    @JsonProperty("language")
    String language
) {
    public FastApiRequest(String text, String language) {
        this.text = text;
        this.language = (language == null || language.isEmpty()) ? "es" : language;
    }
}
```

**Cambio:** Agregado campo `language` con valor por defecto "es"

---

#### `FastApiResponse.java`
```java
public record FastApiResponse(
    @JsonProperty("prevision")
    String prevision,

    @JsonProperty("probabilidad")
    Double probabilidad,

    @JsonProperty("probabilidades_detalle")
    Map<String, Double> probabilidadesDetalle,

    @JsonProperty("idioma")
    String idioma,

    @JsonProperty("timestamp")
    String timestamp
) {}
```

**Cambios:**
-  Agregado `probabilidadesDetalle` (Map con 3 clases)
-  Agregado `idioma`
-  Agregado `timestamp`

---

#### `SentimentRequest.java`
```java
public record SentimentRequest(
    @NotBlank(message = "El texto no puede estar vacío")
    @Size(min = 5, max = 5000, message = "El texto debe tener entre 5 y 5000 caracteres")
    String text,

    @Pattern(regexp = "es|en", message = "El idioma debe ser 'es' o 'en'")
    String language
) {
    public SentimentRequest(String text, String language) {
        this.text = text;
        this.language = (language == null || language.isEmpty()) ? "es" : language;
    }
}
```

**Cambios:**
-  Agregado campo `language` con validación regex
-  Cambiado validación de texto: min 5 caracteres (antes era 1)
-  Valor por defecto "es" si no se especifica

---

#### `SentimentResponse.java`
```java
public class SentimentResponse {
    private String prediction;
    private double probability;
    private Map<String, Double> probabilitiesDetail;
    private String language;
    private String timestamp;

    public SentimentResponse(String prediction, double probability,
                           Map<String, Double> probabilitiesDetail,
                           String language, String timestamp) {
        this.prediction = prediction;
        this.probability = probability;
        this.probabilitiesDetail = probabilitiesDetail;
        this.language = language;
        this.timestamp = timestamp;
    }

    // Getters...
}
```

**Cambios:**
-  Agregado `probabilitiesDetail` (Map<String, Double>)
-  Agregado `language`
-  Agregado `timestamp`

---

### 2. Servicio Actualizado

#### `SentimentService.java`

**Método analyze actualizado:**
```java
public SentimentResponse analyze(String text, String language) {
    // Crear request con idioma
    FastApiRequest request = new FastApiRequest(text, language);

    // Llamar a FastAPI
    FastApiResponse response = webClient.post()
            .uri(predictEndpoint)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(FastApiResponse.class)
            .block();

    if (response == null) {
        throw new RuntimeException("No response received from ML service");
    }

    // Guardar en BD
    SentimentAnalysis entity = new SentimentAnalysis(
            text,
            response.prevision(),
            response.probabilidad()
    );
    repository.save(entity);

    // Retornar respuesta completa
    return new SentimentResponse(
            response.prevision(),
            response.probabilidad(),
            response.probabilidadesDetalle(),
            response.idioma(),
            response.timestamp()
    );
}
```

**Nuevos métodos agregados:**
```java
public List<SentimentAnalysis> getHistory() {
    return repository.findTop10ByOrderByCreatedAtDesc();
}

public List<SentimentAnalysis> getHistoryByPrediction(String prediction) {
    return repository.findByPrediction(prediction);
}

public Long countByPrediction(String prediction) {
    return repository.countByPrediction(prediction);
}
```

---

### 3. Controller Actualizado

#### `SentimentController.java`

**Endpoint POST actualizado:**
```java
@PostMapping
public SentimentResponse analyzeSentiment(
        @RequestBody @Valid SentimentRequest request
) {
    return service.analyze(request.text(), request.language());
}
```

**Nuevos endpoints GET agregados:**

#### GET /api/sentiment/history
```java
@Operation(
    summary = "Obtiene el historial de predicciones",
    description = "Retorna los últimos 10 análisis de sentimiento realizados"
)
@GetMapping("/history")
public List<SentimentAnalysis> getHistory() {
    return service.getHistory();
}
```

**Ejemplo de respuesta:**
```json
[
  {
    "id": 5,
    "text": "Me encanta este servicio",
    "prediction": "Positivo",
    "probability": 0.9905,
    "createdAt": "2026-01-10T15:39:26.516725"
  },
  {
    "id": 4,
    "text": "El producto es normal",
    "prediction": "Neutro",
    "probability": 0.9903,
    "createdAt": "2026-01-10T15:39:13.506517"
  }
]
```

---

#### GET /api/sentiment/history/{prediction}
```java
@Operation(
    summary = "Obtiene predicciones por tipo de sentimiento",
    description = "Retorna todos los análisis que coincidan con el sentimiento especificado"
)
@GetMapping("/history/{prediction}")
public List<SentimentAnalysis> getHistoryByPrediction(@PathVariable String prediction) {
    return service.getHistoryByPrediction(prediction);
}
```

**Ejemplo de uso:**
```bash
GET /api/sentiment/history/Positivo
GET /api/sentiment/history/Neutro
GET /api/sentiment/history/Negativo
```

---

#### GET /api/sentiment/statistics
```java
@Operation(
    summary = "Obtiene estadísticas de predicciones",
    description = "Retorna el conteo de predicciones por cada tipo de sentimiento"
)
@GetMapping("/statistics")
public Map<String, Long> getStatistics() {
    Map<String, Long> stats = new HashMap<>();
    stats.put("Positivo", service.countByPrediction("Positivo"));
    stats.put("Neutro", service.countByPrediction("Neutro"));
    stats.put("Negativo", service.countByPrediction("Negativo"));
    return stats;
}
```

**Ejemplo de respuesta:**
```json
{
  "Positivo": 3,
  "Neutro": 1,
  "Negativo": 1
}
```

---

### 4. Entidad y Repositorio

**Entidad `SentimentAnalysis`** (sin cambios):
```java
@Entity
@Table(name = "sentiment_analysis")
public class SentimentAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 5000)
    private String text;

    @Column(nullable = false, length = 50)
    private String prediction;

    @Column(nullable = false)
    private Double probability;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

**Repositorio `SentimentAnalysisRepository`** (sin cambios, métodos ya existían):
```java
@Repository
public interface SentimentAnalysisRepository extends JpaRepository<SentimentAnalysis, Long> {
    List<SentimentAnalysis> findByPrediction(String prediction);
    Long countByPrediction(String prediction);
    @Query("SELECT AVG(s.probability) FROM SentimentAnalysis s WHERE s.prediction = :prediction")
    Double findAverageProbabilityByPrediction(String prediction);
    List<SentimentAnalysis> findTop10ByOrderByCreatedAtDesc();
}
```

---

## Configuración

### `application.properties`

```properties
spring.application.name=sentiment-api

# SERVER
server.port=8081  # Temporalmente en 8081 (pendiente resolver conflicto puerto 8080)

# H2 DATABASE (DEV)
spring.datasource.url=jdbc:h2:mem:sentimentdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# H2 CONSOLE
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# ML SERVICE (FastAPI)
ml.service.base-url=http://localhost:8000
ml.service.predict-endpoint=/predict
ml.service.timeout-seconds=10
```

**Cambios:**
-  Puerto cambiado temporalmente a 8081 (conflicto con puerto 8080)
-  H2 en modo memoria (datos se pierden al reiniciar)
-  Consola H2 habilitada para debugging

---

## Nuevos Endpoints

### Resumen de Endpoints Disponibles

| Método | Endpoint | Descripción | Puerto |
|--------|----------|-------------|--------|
| POST | `/api/sentiment` | Analizar sentimiento de un texto | 8081 |
| GET | `/api/sentiment/history` | Obtener últimos 10 análisis | 8081 |
| GET | `/api/sentiment/history/{prediction}` | Filtrar por tipo de sentimiento | 8081 |
| GET | `/api/sentiment/statistics` | Obtener estadísticas de conteo | 8081 |
| POST | `/predict` | Predicción ML (FastAPI) | 8000 |
| GET | `/health` | Health check (FastAPI) | 8000 |

---

## Testing Realizado

### Pruebas FastAPI (Puerto 8000)

#### Test 1: Health Check
```bash
curl http://localhost:8000/health
```
**Resultado:**  PASS
```json
{
  "status": "healthy",
  "models": {
    "spanish": true,
    "english": true
  },
  "timestamp": "2026-01-10T14:09:04.603458"
}
```

---

#### Test 2: Predicción en Español
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Este producto es excelente, me encanta", "language": "es"}'
```
**Resultado:**  PASS
```json
{
  "prevision": "Positivo",
  "probabilidad": 0.999,
  "probabilidades_detalle": {
    "Negativo": 0.0001,
    "Neutro": 0.0009,
    "Positivo": 0.999
  },
  "idioma": "es",
  "timestamp": "2026-01-10T14:09:21.847781"
}
```

---

#### Test 3: Predicción en Inglés
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "This product is amazing, I love it", "language": "en"}'
```
**Resultado:**  PASS
```json
{
  "prevision": "Positivo",
  "probabilidad": 0.9452,
  "probabilidades_detalle": {
    "Negativo": 0.0184,
    "Neutro": 0.0364,
    "Positivo": 0.9452
  },
  "idioma": "en",
  "timestamp": "2026-01-10T14:09:41.576269"
}
```

---

#### Test 4: Validación Texto Corto
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Ok", "language": "es"}'
```
**Resultado:**  PASS (Error 422 esperado)
```json
{
  "detail": [{
    "type": "string_too_short",
    "loc": ["body", "text"],
    "msg": "String should have at least 5 characters",
    "input": "Ok",
    "ctx": {"min_length": 5}
  }]
}
```

---

### Pruebas Backend Spring Boot (Puerto 8081)

#### Test 1: Análisis en Español
```bash
curl -X POST http://localhost:8081/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "Este producto es excelente", "language": "es"}'
```
**Resultado:**  PASS
```json
{
  "prediction": "Positivo",
  "probability": 0.9952,
  "probabilitiesDetail": {
    "Negativo": 0.0002,
    "Neutro": 0.0047,
    "Positivo": 0.9952
  },
  "language": "es",
  "timestamp": "2026-01-10T14:15:00.760111"
}
```

---

#### Test 2: Análisis en Inglés (Negativo)
```bash
curl -X POST http://localhost:8081/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "This product is terrible", "language": "en"}'
```
**Resultado:**  PASS
```json
{
  "prediction": "Negativo",
  "probability": 0.9206,
  "probabilitiesDetail": {
    "Negativo": 0.9206,
    "Neutro": 0.0584,
    "Positivo": 0.0211
  },
  "language": "en",
  "timestamp": "2026-01-10T14:15:19.929877"
}
```

---

#### Test 3: Sin Idioma (Español por defecto)
```bash
curl -X POST http://localhost:8081/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "Muy buen servicio"}'
```
**Resultado:**  PASS
```json
{
  "prediction": "Positivo",
  "probability": 0.9956,
  "probabilitiesDetail": {
    "Negativo": 0.0007,
    "Neutro": 0.0037,
    "Positivo": 0.9956
  },
  "language": "es",
  "timestamp": "2026-01-10T14:15:38.909783"
}
```

---

#### Test 4: GET /history
```bash
curl http://localhost:8081/api/sentiment/history
```
**Resultado:**  PASS
```json
[
  {
    "id": 5,
    "text": "Me encanta este servicio",
    "prediction": "Positivo",
    "probability": 0.9905,
    "createdAt": "2026-01-10T15:39:26.516725"
  },
  {
    "id": 4,
    "text": "El producto es normal y cumple su funcion",
    "prediction": "Neutro",
    "probability": 0.9903,
    "createdAt": "2026-01-10T15:39:13.506517"
  },
  {
    "id": 3,
    "text": "This product is amazing",
    "prediction": "Positivo",
    "probability": 0.7355,
    "createdAt": "2026-01-10T15:38:50.189361"
  },
  {
    "id": 2,
    "text": "Horrible servicio, muy decepcionado",
    "prediction": "Negativo",
    "probability": 0.9988,
    "createdAt": "2026-01-10T15:38:19.152918"
  },
  {
    "id": 1,
    "text": "Este producto es excelente y de gran calidad",
    "prediction": "Positivo",
    "probability": 0.9929,
    "createdAt": "2026-01-10T15:38:05.189682"
  }
]
```

---

#### Test 5: GET /history/Positivo
```bash
curl http://localhost:8081/api/sentiment/history/Positivo
```
**Resultado:**  PASS (Retorna solo predicciones positivas)

---

#### Test 6: GET /history/Negativo
```bash
curl http://localhost:8081/api/sentiment/history/Negativo
```
**Resultado:**  PASS (Retorna solo predicciones negativas)

---

#### Test 7: GET /history/Neutro
```bash
curl http://localhost:8081/api/sentiment/history/Neutro
```
**Resultado:**  PASS (Retorna solo predicciones neutras)

---

#### Test 8: GET /statistics
```bash
curl http://localhost:8081/api/sentiment/statistics
```
**Resultado:**  PASS
```json
{
  "Positivo": 3,
  "Neutro": 1,
  "Negativo": 1
}
```

---

## Resumen de Pruebas

| Componente | Tests | Passed | Failed |
|------------|-------|--------|--------|
| FastAPI | 4 | 4 | 0 |
| Backend Spring Boot | 8 | 8 | 0 |
| **Total** | **12** | **12** | **0** |

 **Todos los tests pasaron exitosamente**

---

## Pendientes

###  Alta Prioridad

1. **Puerto 8080 Ocupado**
   - **Problema:** El puerto 8080 está siendo usado por otro proceso
   - **Solución temporal:** Backend corriendo en puerto 8081
   - **Acción requerida:** Investigar y liberar puerto 8080, o actualizar frontend para usar 8081

2. **Frontend Actualización**
   - Agregar selector de idioma (Español/Inglés)
   - Mostrar las 3 clases de sentimiento con probabilidades
   - Agregar sección de historial de análisis
   - Agregar dashboard de estadísticas

3. **Base de Datos Persistente**
   - **Problema:** H2 en memoria pierde datos al reiniciar
   - **Intentado:** H2 en modo archivo falló por file locking Windows/WSL
   - **Opciones:**
     - Instalar PostgreSQL real
     - Usar H2 en modo servidor TCP
     - Aceptar pérdida de datos en desarrollo

###  Media Prioridad

4. **Validación de Modelos**
   - Obtener métricas de evaluación del modelo (accuracy, precision, recall, F1)
   - Probar casos complejos (sarcasmo, negación, contexto mixto)
   - Verificar si probabilidades muy altas (99%+) indican overfitting

5. **Warnings de scikit-learn**
   - Modelos entrenados con scikit-learn 1.7.2
   - API usando scikit-learn 1.8.0
   - Genera warnings pero funciona
   - Considerar reentrenar con versión actual

6. **CORS Configuration**
   - Verificar configuración CORS en Spring Boot para frontend
   - Agregar headers apropiados si es necesario

###  Baja Prioridad

7. **Optimizaciones**
   - Caché de predicciones frecuentes
   - Compresión de respuestas HTTP
   - Paginación en endpoint /history

8. **Monitoring y Logs**
   - Agregar métricas de performance
   - Dashboard de monitoreo
   - Alertas por errores

9. **Testing Adicional**
   - Tests unitarios para DTOs
   - Tests de integración automatizados
   - Tests de carga (stress testing)

---

## Notas Técnicas

### Compatibilidad de Versiones

- **Java:** 17 (requerido, Lombok incompatible con Java 25)
- **Spring Boot:** 3.2.0
- **Python:** 3.13
- **FastAPI:** Última versión
- **Pydantic:** v2.x (cambio de `regex` a `pattern`)
- **scikit-learn:** 1.8.0 (modelos en 1.7.2, genera warnings)

### Decisiones de Arquitectura

1. **Pipelines vs Modelo+Vectorizador:** Se usaron pipelines para simplificar el código
2. **Records vs Classes en Java:** Se usaron records para DTOs inmutables
3. **H2 vs PostgreSQL:** H2 para desarrollo rápido, PostgreSQL recomendado para producción
4. **Puerto 8081:** Solución temporal, debe volver a 8080

### Comandos Útiles

**Iniciar FastAPI:**
```bash
cd data-science/api
python3 -m uvicorn main:app --reload --port 8000
```

**Iniciar Spring Boot:**
```bash
cd backend/sentiment-api
./mvnw spring-boot:run
```

**Ver logs con debug:**
```bash
./mvnw spring-boot:run -e
./mvnw spring-boot:run -X
```

**Matar procesos Java:**
```bash
ps aux | grep java
kill -9 <PID>
```

---

## Documentación API

### Swagger UI

- **FastAPI Docs:** http://localhost:8000/docs
- **Spring Boot Swagger:** http://localhost:8081/swagger-ui.html (si está configurado)

### H2 Console

- **URL:** http://localhost:8081/h2-console
- **JDBC URL:** `jdbc:h2:mem:sentimentdb`
- **Username:** `sa`
- **Password:** (vacío)

## Changelog

### v2.0.0 (2026-01-10)
-  Agregado soporte para 2 idiomas (español/inglés)
-  Agregado soporte para 3 clases (Positivo/Neutro/Negativo)
-  Implementados endpoints GET para historial
-  Implementado endpoint de estadísticas
-  Actualizado FastAPI con validaciones
-  Actualizado Backend con nuevos DTOs
-  Agregada documentación completa
-  Puerto temporal 8081 (pendiente 8080)
