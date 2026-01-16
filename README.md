🧠 Hackathon – Análisis de Sentimientos

Aplicación full-stack para análisis de sentimientos de texto (Positivo / Negativo) usando Machine Learning, Spring Boot y React.

🏗️ Arquitectura
Frontend (React + Vite)
        ↓
Backend (Spring Boot 3 – Java 17)
        ↓
ML Service (FastAPI + scikit-learn)


Frontend: Interfaz web para autenticación y análisis de texto

Backend: Gestión de usuarios, seguridad y orquestación

ML Service: Modelo entrenado de análisis de sentimientos

Base de Datos:

H2 (persistente) → desarrollo

PostgreSQL → objetivo producción

📁 Estructura del Proyecto
hackathon-sentiment-analysis/
│
├── backend/              # Spring Boot API (Puerto 8080)
│
├── data-science/         # ML + FastAPI (Puerto 8000)
│   ├── api/
│   │   └── main.py
│   ├── models/
│   │   ├── pipeline_sentimientos_español.pkl
│   │   └── pipeline_sentimientos_ingles.pkl
│   └── venv/
│
├── frontend-vite/        # React + Vite (Puerto 5173)
│   ├── src/
│   ├── public/
│   └── tailwind.config.js
│
└── docs/                 # Documentación adicional

🚀 Inicio Rápido
1️⃣ ML Service – FastAPI (Python)
cd data-science
venv\Scripts\activate     # Windows
# source venv/bin/activate  # Linux / Mac

uvicorn api.main:app --reload --port 8000


📌 Verificar:

Swagger: http://localhost:8000/docs

Health: http://localhost:8000/health

2️⃣ Backend – Spring Boot
cd backend
mvn spring-boot:run


📌 API disponible en:

http://localhost:8080

3️⃣ Frontend – React + Vite
cd frontend-vite
npm install
npm run dev


📌 Frontend:

http://localhost:5173

🔌 Endpoints
🧠 ML Service (FastAPI) – http://localhost:8000
Método	Endpoint	Descripción
POST	/predict	Analiza sentimiento
GET	/health	Estado del servicio
GET	/docs	Swagger UI

Ejemplo Request

{
  "text": "Me encanta este proyecto",
  "lang": "es"
}


Ejemplo Response

{
  "prediction": "Positivo",
  "probability": 0.999,
  "timestamp": "2026-01-15T18:42:44"
}

⚙️ Backend API – http://localhost:8080
Método	Endpoint	Descripción
POST	/api/auth/register	Registro de usuario
POST	/api/auth/login	Login
POST	`/api
