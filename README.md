# Hackathon NoCountry - Análisis de Sentimientos

API de Machine Learning diseñada para clasificar sentimientos en comentarios (Positivo/Negativo), permitiendo a las empresas automatizar la gestión de feedback y priorizar la atención al cliente.

## Integrantes del Equipo
| Nombre Completo | Usuario GitHub | Backend Developer | Data Scientist | Frontend Developer |
| :--- | :--- | :---: | :---: | :---: |
| Carlos Eduardo Ramírez Wong | CarlosRW | X | | X |
| Raidel Rodriguez | | X | | |
| Diego Vásquez | | X | | |
| Diego Chacon Macias | | X | | |
| Matias Schaff | | X | | |
| Alexander Florez Quintero | alexander-fq | x | | |
| Gisell López | | | X | |
| Beatriz Suyo | | | X | |
| Erik Gonzalez | | | X | |
| Mailyn Zuñiga Padilla | | | X | |
| Miguel Angel Oropeza G. | | | X | |
| Eduin Pino | | | X | X|

# Arquitectura
El proyecto sigue una arquitectura de microservicios e integración híbrida:
**Frontend (React/HTML)** → **Backend (Spring Boot)** → **ML Service (FastAPI)** → **H2/PostgreSQL**

## Estructura del Proyecto
```text
hackathon-sentiment-analysis/
├── backend/           # API REST Spring Boot (Puerto 8080)
├── data-science/      # Modelo ML + API FastAPI (Puerto 8000)
├── frontend/          # Interfaz web React & Estáticos (Puerto 3000)
└── docs/              # Documentación y capturas
```

# Inicio Rápido
### Backend

```bash
cd backend
# La base de datos H2 se creará automáticamente en /data
mvn spring-boot:run
```

### Data Science (ML Service)
```bash
cd data-science
source venv/bin/activate # En Windows use: venv\Scripts\activate
cd api
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm start
```

## Endpoints

### Autenticación (Backend) - http://localhost:8080
- `POST /api/auth/register` - Crear nuevos usuarios
- `POST /api/auth/login` - Iniciar sesión (valida credenciales)

### Análisis (Backend) - http://localhost:8080
- `POST /api/sentiment` - Analizar sentimiento (conecta con ML Service)
- `GET /api/stats` - Estadísticas de uso y persistencia

### ML Service (FastAPI) - http://localhost:8000
- `POST /predict` - Predecir sentimiento
- `GET /health` - Health check
- `GET /docs` - Documentación Swagger

## Git Workflow
```bash
# Trabajar en tu rama
git checkout feature/backend

# Hacer cambios
git add .
git commit -m "feat: implementar sistema de autenticación con Spring Security 6"
git push origin feature/backend

# Crear Pull Request en GitHub
# feature/backend → develop
```

## Tecnologías Utilizadas
- Backend: Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security 6.
- Data Science: Python 3.10, Scikit-learn, Pandas, FastAPI, Joblib.
- Database: H2 (Desarrollo) / PostgreSQL (Producción).
- Frontend: React 18, HTML5/JS (Fetch API).

---

# Guía de Desarrollo por Área

## Para Data Science
```bash
cd ~/hackathon-sentiment-analysis
git checkout feature/data-science
cd data-science
source venv/bin/activate
jupyter notebook
# Trabajar en notebooks/training.ipynb
```

## Para Backend:
```bash
cd ~/hackathon-sentiment-analysis
git checkout feature/backend
cd backend
# Desarrollo de controllers, services y configuración de seguridad
```

## Para Frontend:
```bash
cd ~/hackathon-sentiment-analysis
git checkout feature/frontend
cd frontend
# Para iniciar proyecto React o editar archivos estáticos en backend/src/main/resources/static
```
