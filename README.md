# 🎯 Hackathon - Análisis de Sentimientos

API de Machine Learning para clasificar sentimientos de comentarios como Positivos o Negativos.

# Arquitectura
Frontend (React) → Backend (Spring Boot) → ML Service (FastAPI) → PostgreSQL

## Estructura
hackathon-sentiment-analysis/
├── backend/          # API REST Spring Boot (Puerto 8080)
├── data-science/     # Modelo ML + API FastAPI (Puerto 8000)
├── frontend/         # Interfaz web React (Puerto 3000)
└── docs/            # Documentación

# Inicio Rápido

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Data Science (ML Service)
```bash
cd data-science
source venv/bin/activate
cd api
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm start
```

## Endpoints

### ML Service (FastAPI) - http://localhost:8000
- `POST /predict` - Predecir sentimiento
- `GET /health` - Health check
- `GET /docs` - Documentación Swagger

### Backend API - http://localhost:8080
- `POST /api/sentiment` - Analizar sentimiento
- `GET /api/stats` - Estadísticas

## Equipo

- **Backend**: [Nombres]
- **Data Science**: [Nombres]
- **Frontend**: [Nombres]

## Git Workflow
```bash
# Trabajar en tu rama
git checkout feature/backend  # o tu rama

# Hacer cambios
git add .
git commit -m "feat: descripción"
git push origin feature/backend

# Crear Pull Request en GitHub
# feature/backend → develop
```

## Tecnologías

- Java 17 + Spring Boot 3.x
- Python 3.10 + scikit-learn + FastAPI
- React 18
- PostgreSQL 15

---
