# Guía de Implementación - API FastAPI con Pipelines ML

## Resumen de Cambios

Se ha actualizado la API FastAPI para soportar análisis de sentimientos en español e inglés utilizando pipelines de ML.

---

## Cambios Implementados

### 1. Estructura de Archivos

```
data-science/
├── api/
│   └── main.py                                  (ACTUALIZADO)
├── models/
│   ├── pipeline_sentimientos_español.pkl        (NUEVO)
│   ├── pipeline_sentimientos_ingles.pkl         (NUEVO)
│   ├── modelo_sentimientos_español.pkl
│   ├── modelo_sentimientos_ingles.pkl
│   ├── tfidf_vectorizador_español.pkl
│   └── tfidf_vectorizador_ingles.pkl
└── requirements.txt
```

---

## 2. Características Principales

### Soporte Multiidioma
- Español (es)
- Inglés (en)

### Validaciones Implementadas
- Longitud mínima: 5 caracteres
- Longitud máxima: 5000 caracteres
- Validación de texto vacío
- Validación de caracteres alfanuméricos

### Tres Sentimientos
- Positivo
- Neutro
- Negativo

---

## 3. Endpoints Disponibles

### GET /
Información del servicio

**Response:**
```json
{
  "service": "Sentiment Analysis ML Service",
  "version": "2.0.0",
  "status": "running",
  "models_available": {
    "spanish": true,
    "english": true
  },
  "supported_languages": ["es", "en"]
}
```

### GET /health
Health check del servicio

**Response:**
```json
{
  "status": "healthy",
  "models": {
    "spanish": true,
    "english": true
  },
  "timestamp": "2024-01-10T10:30:00.000000"
}
```

### POST /predict
Predice el sentimiento de un texto

**Request:**
```json
{
  "text": "Este producto es excelente, me encanta",
  "language": "es"
}
```

**Response:**
```json
{
  "prevision": "Positivo",
  "probabilidad": 0.9234,
  "probabilidades_detalle": {
    "Positivo": 0.9234,
    "Neutro": 0.0543,
    "Negativo": 0.0223
  },
  "idioma": "es",
  "timestamp": "2024-01-10T10:30:00.000000"
}
```

---

## 4. Validaciones y Errores

### Error 400 - Bad Request
**Casos:**
- Texto menor a 5 caracteres
- Texto mayor a 5000 caracteres
- Texto solo con caracteres especiales
- Idioma no soportado

**Ejemplo:**
```json
{
  "detail": "El texto debe tener al menos 5 caracteres"
}
```

### Error 503 - Service Unavailable
**Caso:**
- Modelo no disponible para el idioma solicitado

**Ejemplo:**
```json
{
  "detail": "El modelo de español no está disponible"
}
```

### Error 500 - Internal Server Error
**Caso:**
- Error durante la predicción

**Ejemplo:**
```json
{
  "detail": "Error al procesar la predicción: ..."
}
```

---

## 5. Cómo Ejecutar la API

### Opción 1: Ejecutar directamente
```bash
cd data-science/api
uvicorn main:app --reload --port 8000
```

### Opción 2: Ejecutar con Python
```bash
cd data-science/api
python main.py
```

### Opción 3: Ejecutar con Docker
```bash
cd data-science
docker build -t sentiment-ml-api .
docker run -p 8000:8000 sentiment-ml-api
```

---

## 6. Testing de la API

### Usando cURL

**Español:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Este producto es excelente",
    "language": "es"
  }'
```

**Inglés:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This product is amazing",
    "language": "en"
  }'
```

### Usando Python
```python
import requests

response = requests.post(
    "http://localhost:8000/predict",
    json={
        "text": "Este producto es excelente",
        "language": "es"
    }
)

print(response.json())
```

### Usando Swagger UI
Abrir en navegador: `http://localhost:8000/docs`

---

## 7. Logs

La API utiliza logging estándar de Python:

```
INFO:     Pipeline español cargado correctamente: 3 clases
INFO:     Clases disponibles: ['Negativo' 'Neutro' 'Positivo']
INFO:     Pipeline inglés cargado correctamente: 3 clases
INFO:     Clases disponibles: ['Negative' 'Neutral' 'Positive']
INFO:     Predicción exitosa - Idioma: es, Resultado: Positivo, Confianza: 0.9234
```

---

## 8. Integración con Backend Spring Boot

El backend Spring Boot debe enviar requests en este formato:

**Request del Backend:**
```java
FastApiRequest request = new FastApiRequest(
    text,
    language  // "es" o "en"
);
```

**Actualizar FastApiResponse.java:**
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

---

## 9. Variables de Entorno (Opcional)

Crear archivo `.env`:
```
ML_MODELS_PATH=../models
LOG_LEVEL=INFO
API_HOST=0.0.0.0
API_PORT=8000
```

---

## 10. Próximos Pasos

### Inmediatos:
1. Probar la API localmente
2. Verificar que carga ambos pipelines
3. Probar predicciones en español e inglés
4. Verificar validaciones

### Backend:
1. Actualizar DTOs para incluir campo `language`
2. Actualizar `FastApiResponse` con nuevos campos
3. Actualizar `SentimentService` para pasar idioma

### Frontend:
1. Agregar selector de idioma
2. Mostrar las 3 clases de sentimiento
3. Mostrar probabilidades detalladas (opcional)

---

## Notas Técnicas

### Por qué usar Pipelines:
- Incluye preprocesamiento automático
- Más simple que modelo + vectorizador por separado
- Un solo archivo por idioma
- Menos probabilidad de errores
- Código más limpio

### Formato de Clases:
- Los modelos retornan strings directamente
- NO necesitan mapeo numérico
- Español: "Positivo", "Neutro", "Negativo"
- Inglés: "Positive", "Neutral", "Negative"

---

## Troubleshooting

### Error: "Pipeline español no encontrado"
**Solución:** Verificar que los archivos .pkl estén en `data-science/models/`

### Error: "No module named 'joblib'"
**Solución:**
```bash
pip install joblib
```

### Error: "Error al cargar pipeline"
**Solución:** Verificar que los archivos .pkl no estén corruptos:
```bash
cd data-science/models
python -c "import joblib; p = joblib.load('pipeline_sentimientos_español.pkl'); print(p.classes_)"
```

### Error: Predicción incorrecta
**Solución:** Verificar que el idioma del texto coincida con el parámetro `language`

---

## Contacto

Para dudas o problemas con la implementación:
- Revisar logs: `journalctl -u sentiment-api -f`
- Documentación Swagger: `http://localhost:8000/docs`
- Redocly: `http://localhost:8000/redoc`
