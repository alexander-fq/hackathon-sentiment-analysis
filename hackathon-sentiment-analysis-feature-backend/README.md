# Hackathon - Análisis de Sentimientos

Sistema de análisis de sentimientos profesional con soporte para múltiples idiomas (Español e Inglés) y clasificación en 3 categorías: Positivo, Neutro y Negativo.

Version: 2.0.0

---

## Características Principales

- Análisis de sentimientos en 2 idiomas (Español e Inglés)
- Clasificación en 3 categorías (Positivo, Neutro, Negativo)
- Probabilidades detalladas por cada clase
- Historial de análisis con base de datos
- Estadísticas y métricas de sentimiento
- API REST profesional con validaciones
- Documentación Swagger/OpenAPI

---

## Arquitectura

```
Frontend (Vanilla JS) → Backend (Spring Boot) → ML Service (FastAPI) → H2 Database
```

### Estructura del Proyecto

```
hackathon-sentiment-analysis/
├── backend/
│   └── sentiment-api/         # API REST Spring Boot (Puerto 8080/8081)
│       ├── src/main/java/com/hackathon/sentiment/
│       │   ├── controller/    # REST Controllers
│       │   ├── service/       # Business Logic
│       │   ├── dto/          # Data Transfer Objects
│       │   ├── model/        # JPA Entities
│       │   └── repository/   # JPA Repositories
│       └── pom.xml
├── data-science/
│   ├── api/                  # ML Service FastAPI (Puerto 8000)
│   │   └── main.py
│   ├── models/               # Modelos ML entrenados (.pkl)
│   │   ├── pipeline_sentimientos_español.pkl
│   │   └── pipeline_sentimientos_ingles.pkl
│   └── requirements.txt
├── frontend/
│   └── public/               # Interfaz web (index.html, app.js, styles.css)
└── docs/                     # Documentación del proyecto
```

---

## Requisitos Previos

### Java Backend
- **Java 17** (REQUERIDO - Java 25 no es compatible con Lombok)
- Maven 3.6+
- Puerto 8080 disponible

### Python ML Service
- Python 3.10+
- pip o conda
- Puerto 8000 disponible

### Frontend
- Navegador web moderno
- No requiere Node.js (Vanilla JS)

---

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd hackathon-sentiment-analysis
```

### 2. Configurar Backend (Spring Boot)

```bash
cd backend/sentiment-api

# Verificar versión de Java (debe ser 17)
java -version

# Compilar proyecto
./mvnw clean install
```

Si tienes problemas con Java, consulta: [COMPILE_INSTRUCTIONS.md](backend/sentiment-api/COMPILE_INSTRUCTIONS.md)

### 3. Configurar ML Service (FastAPI)

```bash
cd data-science/api

# Crear entorno virtual (opcional pero recomendado)
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### 4. Verificar Modelos ML

Asegúrate de que los modelos entrenados estén en `data-science/models/`:
- `pipeline_sentimientos_español.pkl` (307 KB)
- `pipeline_sentimientos_ingles.pkl` (304 KB)

---

## Inicio Rápido

### Terminal 1: Iniciar FastAPI (ML Service)

```bash
cd data-science/api
python3 -m uvicorn main:app --reload --port 8000
```

Verificar: http://localhost:8000/health

Respuesta esperada:
```json
{
  "status": "healthy",
  "models": {
    "spanish": true,
    "english": true
  },
  "timestamp": "2026-01-12T10:00:00"
}
```

### Terminal 2: Iniciar Backend (Spring Boot)

```bash
cd backend/sentiment-api
./mvnw spring-boot:run
```

Verificar: http://localhost:8080/api/health

### Terminal 3: Abrir Frontend

```bash
cd frontend/public
# Abrir index.html en el navegador
```

O usar un servidor HTTP simple:
```bash
python3 -m http.server 3000
# Abrir http://localhost:3000
```

---

## Endpoints de la API

### ML Service (FastAPI) - Puerto 8000

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check del servicio ML |
| POST | `/predict` | Predicción de sentimiento |
| GET | `/docs` | Documentación Swagger |

#### Ejemplo: POST /predict

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
  "probabilidad": 0.9952,
  "probabilidades_detalle": {
    "Negativo": 0.0002,
    "Neutro": 0.0047,
    "Positivo": 0.9952
  },
  "idioma": "es",
  "timestamp": "2026-01-12T14:15:00.760111"
}
```

---

### Backend API (Spring Boot) - Puerto 8080

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/sentiment` | Analizar sentimiento de texto |
| GET | `/api/sentiment/history` | Últimos 10 análisis realizados |
| GET | `/api/sentiment/history/{prediction}` | Filtrar por sentimiento (Positivo/Neutro/Negativo) |
| GET | `/api/sentiment/statistics` | Estadísticas de conteo por sentimiento |

#### Ejemplo: POST /api/sentiment

**Request:**
```json
{
  "text": "This product is terrible",
  "language": "en"
}
```

**Response:**
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
  "timestamp": "2026-01-12T14:15:19.929877"
}
```

#### Ejemplo: GET /api/sentiment/history

**Response:**
```json
[
  {
    "id": 5,
    "text": "Me encanta este servicio",
    "prediction": "Positivo",
    "probability": 0.9905,
    "createdAt": "2026-01-12T15:39:26.516725"
  },
  {
    "id": 4,
    "text": "El producto es normal",
    "prediction": "Neutro",
    "probability": 0.9903,
    "createdAt": "2026-01-12T15:39:13.506517"
  }
]
```

#### Ejemplo: GET /api/sentiment/statistics

**Response:**
```json
{
  "Positivo": 3,
  "Neutro": 1,
  "Negativo": 1
}
```

---

## Validaciones

### Texto
- Mínimo: 5 caracteres
- Máximo: 5000 caracteres
- Debe contener al menos un carácter alfanumérico

### Idioma
- Valores permitidos: `"es"` (español) o `"en"` (inglés)
- Valor por defecto: `"es"` si no se especifica

### Códigos de Error
- **400 Bad Request**: Request inválido o campos vacíos
- **422 Unprocessable Entity**: Validación fallida (texto muy corto, idioma inválido)
- **503 Service Unavailable**: Servicio ML no disponible

---

## Testing

Ejecuta las pruebas según la guía: [TESTING_GUIDE.md](TESTING_GUIDE.md)

### Pruebas Rápidas con cURL

**Test 1: Análisis en Español**
```bash
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "Este producto es excelente", "language": "es"}'
```

**Test 2: Análisis en Inglés**
```bash
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "This product is amazing", "language": "en"}'
```

**Test 3: Historial**
```bash
curl http://localhost:8080/api/sentiment/history
```

**Test 4: Estadísticas**
```bash
curl http://localhost:8080/api/sentiment/statistics
```

### Resultados de Testing

**Resumen:** 12/12 tests PASSED

| Componente | Tests | Passed | Failed |
|------------|-------|--------|--------|
| FastAPI | 4 | 4 | 0 |
| Backend Spring Boot | 8 | 8 | 0 |

---

## Base de Datos

### H2 Database (Desarrollo)

- **Modo:** In-memory (los datos se pierden al reiniciar)
- **JDBC URL:** `jdbc:h2:mem:sentimentdb`
- **Console:** http://localhost:8080/h2-console
- **Username:** `sa`
- **Password:** (vacío)

**Tabla Principal:**
```sql
SELECT * FROM sentiment_analysis;
```

Columnas: `id`, `text`, `prediction`, `probability`, `created_at`

---

## Tecnologías

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Web
- Spring Data JPA
- H2 Database
- Maven
- Lombok

### ML Service
- Python 3.13
- FastAPI
- Pydantic v2
- scikit-learn 1.8.0
- joblib
- uvicorn

### Frontend
- Vanilla JavaScript
- HTML5
- CSS3 (Glassmorphism design)
- Fetch API

### Machine Learning
- Logistic Regression
- TF-IDF Vectorization
- scikit-learn Pipelines
- 3 clases: Positivo, Neutro, Negativo
- 2 idiomas: Español, Inglés

---

## Documentación Adicional

Toda la documentación se encuentra en la carpeta `docs/`:

- [CAMBIOS_IMPLEMENTACION.md](docs/CAMBIOS_IMPLEMENTACION.md) - Documentación completa de cambios
- [TAREAS_FRONTEND.md](docs/TAREAS_FRONTEND.md) - Tareas pendientes del frontend (11 tareas)
- [TESTING_GUIDE.md](docs/TESTING_GUIDE.md) - Guía paso a paso de testing
- [BACKEND_CHANGES.md](docs/BACKEND_CHANGES.md) - Cambios detallados del backend
- [API_IMPLEMENTATION_GUIDE.md](docs/API_IMPLEMENTATION_GUIDE.md) - Guía de implementación FastAPI
- [COMPILE_INSTRUCTIONS.md](docs/COMPILE_INSTRUCTIONS.md) - Instrucciones de compilación
- [README_DATA_SCIENCE.md](docs/README_DATA_SCIENCE.md) - Documentación del proceso de ML
- [TEST_ENDPOINTS.md](docs/TEST_ENDPOINTS.md) - Ejemplos de prueba de endpoints
- [FEATURES_AVANZADAS_POR_EQUIPO.md](docs/FEATURES_AVANZADAS_POR_EQUIPO.md) - Features por equipo
- [GUIA_USO_DATASET_ROBUSTO.md](docs/GUIA_USO_DATASET_ROBUSTO.md) - Guía de datasets

---

## Git Workflow

### Ramas

- `main` - Rama principal (producción)
- `develop` - Rama de desarrollo
- `feature/backend` - Desarrollo del backend (rama actual)
- `feature/frontend` - Desarrollo del frontend
- `feature/data-science` - Desarrollo de modelos ML

### Comandos Comunes

```bash
# Actualizar repositorio local
git pull origin feature/backend

# Hacer cambios
git add .
git commit -m "feat: descripción del cambio"
git push origin feature/backend

# Crear Pull Request en GitHub
# feature/backend → main
```

---

## Notas Técnicas

### H2 Database en Desarrollo
- Los datos se almacenan en memoria y se pierden al reiniciar
- Para producción se recomienda usar PostgreSQL u otra base de datos persistente

### Warnings de scikit-learn
- Los modelos fueron entrenados con scikit-learn 1.7.2
- La API usa scikit-learn 1.8.0
- Esto genera warnings en los logs pero no afecta la funcionalidad
- Recomendación: Reentrenar modelos con la versión actual (baja prioridad)

---

## Roadmap

### Completado
- Integración de modelos ML (.pkl)
- API FastAPI con validaciones
- Backend Spring Boot con endpoints REST
- Base de datos H2 para historial
- 3 endpoints GET (history, history/{prediction}, statistics)
- Testing completo (12/12 tests)
- Documentación completa

### Pendiente (Ver TAREAS_FRONTEND.md)
1. Selector de idioma en frontend
2. Mostrar 3 probabilidades detalladas
3. Mostrar idioma y timestamp
4. Sección de historial de análisis
5. Dashboard de estadísticas
6. Filtro por sentimiento en historial
7. Validación avanzada en frontend
8. Mejorar manejo de errores
9. Botones de refrescar
10. Responsive design
11. Correcciones de texto

---

## Equipo

- **Backend**: Backend Team
- **Data Science**: Data Science Team
- **Frontend**: Frontend Team

---

## Soporte

### Documentación Swagger
- FastAPI: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

### Logs
```bash
# Ver logs de FastAPI en tiempo real
# (en la terminal donde corre el servicio)

# Ver logs de Spring Boot con debug
cd backend/sentiment-api
./mvnw spring-boot:run -X
```

### Troubleshooting

**Error: "Pipeline español no encontrado"**
- Verificar que los archivos .pkl estén en `data-science/models/`

**Error: "Connection refused"**
- Asegurarse de que FastAPI esté corriendo en puerto 8000

**Error de compilación Java**
- Verificar que estés usando Java 17 (no Java 25)
- Ver: [COMPILE_INSTRUCTIONS.md](backend/sentiment-api/COMPILE_INSTRUCTIONS.md)

---

## Changelog

### v2.0.0 (2026-01-10)
- Agregado soporte para 2 idiomas (español/inglés)
- Agregado soporte para 3 clases (Positivo/Neutro/Negativo)
- Implementados endpoints GET para historial
- Implementado endpoint de estadísticas
- Actualizado FastAPI con validaciones Pydantic v2
- Actualizado Backend con nuevos DTOs
- Agregada documentación completa
- Todos los tests (12/12) pasando exitosamente

---

Última actualización: 2026-01-12
