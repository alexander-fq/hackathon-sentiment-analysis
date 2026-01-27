# Cambios en el Backend - Spring Boot

## Resumen

Se ha actualizado el backend Spring Boot para soportar:
- Análisis de sentimientos en 2 idiomas (español e inglés)
- 3 clases de sentimiento (Positivo, Neutro, Negativo)
- Probabilidades detalladas por clase
- Validaciones mejoradas

---

## Archivos Modificados

### 1. FastApiRequest.java
**Ubicación:** `backend/sentiment-api/src/main/java/com/hackathon/sentiment/dto/FastApiRequest.java`

**Cambios:**
- Agregado campo `language` (String)
- Valor por defecto: "es"
- Validación automática si viene null o vacío

**Antes:**
```java
public record FastApiRequest(String text) {}
```

**Después:**
```java
public record FastApiRequest(
    @JsonProperty("text") String text,
    @JsonProperty("language") String language
) {
    public FastApiRequest {
        if (language == null || language.isEmpty()) {
            language = "es";
        }
    }
}
```

---

### 2. FastApiResponse.java
**Ubicación:** `backend/sentiment-api/src/main/java/com/hackathon/sentiment/dto/FastApiResponse.java`

**Cambios:**
- Agregado campo `probabilidadesDetalle` (Map<String, Double>)
- Agregado campo `idioma` (String)

**Antes:**
```java
public record FastApiResponse(
    String prevision,
    Double probabilidad,
    String timestamp
) {}
```

**Después:**
```java
public record FastApiResponse(
    String prevision,
    Double probabilidad,
    Map<String, Double> probabilidadesDetalle,
    String idioma,
    String timestamp
) {}
```

---

### 3. SentimentRequest.java
**Ubicación:** `backend/sentiment-api/src/main/java/com/hackathon/sentiment/dto/SentimentRequest.java`

**Cambios:**
- Agregado campo `language` (String)
- Validación con Pattern: solo acepta "es" o "en"
- Validación de longitud cambiada a min=5, max=5000
- Valor por defecto: "es"

**Antes:**
```java
public record SentimentRequest(
    @NotBlank
    @Size(min = 3)
    String text
) {}
```

**Después:**
```java
public record SentimentRequest(
    @NotBlank
    @Size(min = 5, max = 5000)
    String text,

    @Pattern(regexp = "es|en")
    String language
) {
    public SentimentRequest {
        if (language == null || language.isEmpty()) {
            language = "es";
        }
    }
}
```

---

### 4. SentimentResponse.java
**Ubicación:** `backend/sentiment-api/src/main/java/com/hackathon/sentiment/dto/SentimentResponse.java`

**Cambios:**
- Agregado campo `probabilitiesDetail` (Map<String, Double>)
- Agregado campo `language` (String)
- Agregado campo `timestamp` (String)

**Antes:**
```java
public class SentimentResponse {
    private String prediction;
    private double probability;
}
```

**Después:**
```java
public class SentimentResponse {
    private String prediction;
    private double probability;
    private Map<String, Double> probabilitiesDetail;
    private String language;
    private String timestamp;
}
```

---

### 5. SentimentService.java
**Ubicación:** `backend/sentiment-api/src/main/java/com/hackathon/sentiment/service/SentimentService.java`

**Cambios:**
- Método `analyze()` ahora recibe parámetro `language`
- Se pasa el idioma a FastAPI
- Se mapean todos los campos nuevos en la respuesta

**Antes:**
```java
public SentimentResponse analyze(String text) {
    FastApiRequest request = new FastApiRequest(text);
    // ...
    return new SentimentResponse(
        response.prevision(),
        response.probabilidad()
    );
}
```

**Después:**
```java
public SentimentResponse analyze(String text, String language) {
    FastApiRequest request = new FastApiRequest(text, language);
    // ...
    return new SentimentResponse(
        response.prevision(),
        response.probabilidad(),
        response.probabilidadesDetalle(),
        response.idioma(),
        response.timestamp()
    );
}
```

---

### 6. SentimentController.java
**Ubicación:** `backend/sentiment-api/src/main/java/com/hackathon/sentiment/controller/SentimentController.java`

**Cambios:**
- Se pasa `request.language()` al servicio
- Actualizada documentación Swagger
- Agregados códigos de respuesta 422 y 503

**Antes:**
```java
public SentimentResponse analyzeSentiment(@RequestBody @Valid SentimentRequest request) {
    return service.analyze(request.text());
}
```

**Después:**
```java
public SentimentResponse analyzeSentiment(@RequestBody @Valid SentimentRequest request) {
    return service.analyze(request.text(), request.language());
}
```

---

## Formato de Request/Response

### Request al Backend
```json
POST /api/sentiment
{
  "text": "Este producto es excelente",
  "language": "es"
}
```

Si no se especifica `language`, se usa "es" por defecto.

### Response del Backend
```json
{
  "prediction": "Positivo",
  "probability": 0.9234,
  "probabilitiesDetail": {
    "Positivo": 0.9234,
    "Neutro": 0.0543,
    "Negativo": 0.0223
  },
  "language": "es",
  "timestamp": "2024-01-10T10:30:00.000000"
}
```

---

## Validaciones

| Campo | Validación | Error |
|-------|------------|-------|
| text | No vacío | 400 |
| text | Min 5 caracteres | 422 |
| text | Max 5000 caracteres | 422 |
| language | Solo "es" o "en" | 422 |

---

## Flujo de Datos

```
1. Cliente (Frontend/Postman)
   POST /api/sentiment
   {text: "...", language: "es"}
        ↓
2. SentimentController
   Valida request
        ↓
3. SentimentService
   Crea FastApiRequest(text, language)
        ↓
4. WebClient → FastAPI (puerto 8000)
   POST /predict
   {text: "...", language: "es"}
        ↓
5. FastAPI procesa con pipeline
   Retorna FastApiResponse
        ↓
6. SentimentService
   Guarda en BD
   Crea SentimentResponse
        ↓
7. Cliente recibe respuesta completa
```

---

## Testing

### Con cURL
```bash
# Español
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "Este producto es excelente", "language": "es"}'

# Inglés
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "This product is amazing", "language": "en"}'

# Sin idioma (usa español por defecto)
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "Este producto es bueno"}'
```

### Con Swagger UI
1. Abrir: http://localhost:8080/swagger-ui.html
2. Probar endpoint POST /api/sentiment
3. Ingresar texto y idioma

---

## Próximos Pasos

1. Compilar el proyecto:
```bash
cd backend/sentiment-api
./mvnw clean package
```

2. Ejecutar:
```bash
./mvnw spring-boot:run
```

3. Verificar que FastAPI esté corriendo en puerto 8000

4. Probar integración completa

---

## Compatibilidad

### Retrocompatibilidad
El campo `language` tiene valor por defecto "es", por lo que:
- Requests antiguos sin `language` seguirán funcionando
- Se analizarán como español por defecto

### Nuevas Características
- Soporte para inglés agregando `"language": "en"`
- Probabilidades detalladas en la respuesta
- Información de idioma y timestamp

---

## Notas

- Los 3 sentimientos son: Positivo, Neutro, Negativo
- El mapeo de sentimientos se hace en FastAPI, no en el backend
- La base de datos sigue guardando solo: texto, predicción, probabilidad
- Los campos adicionales (probabilitiesDetail, language, timestamp) solo se retornan al cliente
