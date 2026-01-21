# Guía de Testing - API de Análisis de Sentimientos

## Problema Actual: Compilación del Backend

Hay un problema de incompatibilidad entre Lombok y Java 25.

### Soluciones Posibles:

#### Opción 1: Usar Java 17 (Recomendado)
```bash
# Instalar Java 17
# Configurar JAVA_HOME para apuntar a Java 17
# Recompilar
cd backend/sentiment-api
./mvnw clean compile
```

#### Opción 2: Actualizar Lombok en pom.xml
Cambiar la versión de Lombok a la última compatible con Java 25.

#### Opción 3: Compilar en otro entorno
Usar un entorno con Java 17 (por ejemplo, dentro de Docker o WSL con Java 17).

---

## Pruebas una vez resuelto el problema de compilación

### PASO 1: Levantar FastAPI (ML Service)

```bash
# Terminal 1
cd data-science/api
uvicorn main:app --reload --port 8000
```

Verificar que cargue:
```
INFO:     Pipeline español cargado correctamente: 3 clases
INFO:     Clases disponibles: ['Negativo' 'Neutro' 'Positivo']
INFO:     Pipeline inglés cargado correctamente: 3 clases
```

---

### PASO 2: Levantar Backend Spring Boot

```bash
# Terminal 2
cd backend/sentiment-api
./mvnw spring-boot:run
```

Verificar que inicie en puerto 8080

---

### PASO 3: Probar FastAPI Directamente

#### Test 1: Health Check
```bash
curl http://localhost:8000/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "models": {
    "spanish": true,
    "english": true
  },
  "timestamp": "..."
}
```

#### Test 2: Predicción en Español
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Este producto es excelente, me encanta",
    "language": "es"
  }'
```

Respuesta esperada:
```json
{
  "prevision": "Positivo",
  "probabilidad": 0.9xxx,
  "probabilidades_detalle": {
    "Positivo": 0.9xxx,
    "Neutro": 0.0xxx,
    "Negativo": 0.0xxx
  },
  "idioma": "es",
  "timestamp": "..."
}
```

#### Test 3: Predicción en Inglés
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This product is amazing, I love it",
    "language": "en"
  }'
```

#### Test 4: Validación - Texto Corto
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Ok",
    "language": "es"
  }'
```

Debe retornar error 422

---

### PASO 4: Probar Backend Spring Boot

#### Test 1: Health Check
```bash
curl http://localhost:8080/actuator/health
```

#### Test 2: Análisis en Español
```bash
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Este producto es excelente",
    "language": "es"
  }'
```

Respuesta esperada:
```json
{
  "prediction": "Positivo",
  "probability": 0.9xxx,
  "probabilitiesDetail": {
    "Positivo": 0.9xxx,
    "Neutro": 0.0xxx,
    "Negativo": 0.0xxx
  },
  "language": "es",
  "timestamp": "..."
}
```

#### Test 3: Análisis en Inglés
```bash
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This product is terrible",
    "language": "en"
  }'
```

#### Test 4: Sin especificar idioma (debe usar español por defecto)
```bash
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Muy buen servicio"
  }'
```

---

### PASO 5: Usar Scripts de Testing

#### FastAPI Test Script
```bash
cd data-science/api
python test_api.py
```

Este script ejecuta 10 tests automáticos.

---

### PASO 6: Probar desde Swagger UI

#### FastAPI Swagger
```
http://localhost:8000/docs
```

#### Backend Swagger
```
http://localhost:8080/swagger-ui.html
```

---

## Casos de Prueba Importantes

### 1. Sentimiento Positivo (Español)
```json
{"text": "Excelente producto, muy recomendado", "language": "es"}
```

### 2. Sentimiento Negativo (Español)
```json
{"text": "Terrible servicio, muy mala experiencia", "language": "es"}
```

### 3. Sentimiento Neutro (Español)
```json
{"text": "El producto es normal, nada especial", "language": "es"}
```

### 4. Sentimiento Positivo (Inglés)
```json
{"text": "Amazing product, highly recommended", "language": "en"}
```

### 5. Sentimiento Negativo (Inglés)
```json
{"text": "Terrible service, very bad experience", "language": "en"}
```

### 6. Validación - Texto Vacío
```json
{"text": "", "language": "es"}
```
Debe retornar error 422

### 7. Validación - Texto Muy Corto
```json
{"text": "Ok", "language": "es"}
```
Debe retornar error 422

### 8. Validación - Idioma Inválido
```json
{"text": "Test text", "language": "fr"}
```
Debe retornar error 422

### 9. Sin Idioma (usa español por defecto)
```json
{"text": "Este es un texto de prueba"}
```

---

## Verificar Logs

### FastAPI Logs
En la terminal donde corre FastAPI debes ver:
```
INFO:     Predicción exitosa - Idioma: es, Resultado: Positivo, Confianza: 0.9xxx
```

### Backend Logs
En la terminal donde corre Spring Boot

debes ver las peticiones HTTP

---

## Checklist de Verificación

- [ ] FastAPI carga ambos pipelines (español e inglés)
- [ ] FastAPI responde en /health
- [ ] FastAPI predice correctamente en español
- [ ] FastAPI predice correctamente en inglés
- [ ] FastAPI valida texto muy corto
- [ ] FastAPI valida idioma inválido
- [ ] Backend inicia sin errores
- [ ] Backend llama a FastAPI correctamente
- [ ] Backend retorna todos los campos nuevos
- [ ] Backend usa español por defecto si no se especifica idioma
- [ ] Swagger UI funciona en ambos servicios

---

## Troubleshooting

### Error: "Pipeline español no encontrado"
**Causa:** Los archivos .pkl no están en data-science/models/
**Solución:** Verificar que los archivos existan en la ubicación correcta

### Error: "Connection refused" al llamar FastAPI desde Backend
**Causa:** FastAPI no está corriendo
**Solución:** Levantar FastAPI primero

### Error: "Modelo no disponible"
**Causa:** Los pipelines no cargaron correctamente
**Solución:** Revisar logs de FastAPI al iniciar

### Error de compilación en Backend
**Causa:** Incompatibilidad Java 25 con Lombok
**Solución:** Usar Java 17 o actualizar Lombok

---

## Próximos Pasos después del Testing

1. Resolver problema de compilación del backend
2. Ejecutar todos los tests
3. Verificar integración completa
4. Preparar para deployment
5. Documentar resultados
