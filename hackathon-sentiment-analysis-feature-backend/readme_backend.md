# Guía de Instalación Completa

Guía paso a paso para ejecutar el proyecto de Análisis de Sentimientos en tu computadora local.

---

## Requisitos del Sistema

| Componente | Versión Requerida | Verificar con |
|------------|-------------------|---------------|
| Java | **17** (obligatorio) | `java -version` |
| Maven | 3.6+ | `mvn -version` |
| Python | 3.10+ | `python3 --version` |
| pip | 20+ | `pip --version` |
| Git | 2.0+ | `git --version` |

> **IMPORTANTE**: Java 25 NO es compatible con Lombok. Usa Java 17.

---

## 1. Clonar el Repositorio

```bash
git clone https://github.com/alexander-fq/hackathon-sentiment-analysis.git
cd hackathon-sentiment-analysis
git checkout feature/backend
```

---

## 2. Instalar Java 17

### Windows
1. Descargar: https://adoptium.net/temurin/releases/?version=17
2. Instalar el .msi
3. Verificar: `java -version`

### Ubuntu/WSL
```bash
sudo apt update
sudo apt install openjdk-17-jdk
java -version
```

### Si tienes múltiples versiones de Java
```bash
# Listar versiones instaladas
sudo update-alternatives --config java

# Seleccionar Java 17
```

---

## 3. Instalar Python y Dependencias

### Crear entorno virtual (recomendado)
```bash
cd data-science/api
python3 -m venv venv

# Activar entorno virtual
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

### Instalar dependencias
```bash
pip install -r requirements.txt
```

### Dependencias de Python (requirements.txt)
```
# API Framework
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3

# Machine Learning
scikit-learn==1.4.0
pandas==2.2.0
numpy==1.26.3
joblib==1.3.2

# Procesamiento de texto
nltk==3.8.1

# Utilidades
python-multipart==0.0.6
python-dotenv==1.0.0
loguru==0.7.2
```

### Descargar recursos NLTK (primera vez)
```bash
python3 -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

---

## 4. Compilar Backend (Spring Boot)

```bash
cd backend/sentiment-api

# Dar permisos de ejecución (solo Linux/WSL, primera vez)
chmod +x mvnw

# Compilar (omitir tests para rapidez)
./mvnw clean install -DskipTests

# O en Windows:
mvnw.cmd clean install -DskipTests

# Alternativa si no funciona el wrapper:
mvn clean install -DskipTests
```

### Dependencias de Maven (pom.xml)
| Dependencia | Descripción |
|-------------|-------------|
| spring-boot-starter-web | API REST |
| spring-boot-starter-data-jpa | Base de datos |
| spring-boot-starter-security | Autenticación |
| spring-boot-starter-validation | Validaciones |
| h2 | Base de datos en memoria |
| lombok | Reducir boilerplate |
| springdoc-openapi | Swagger UI |
| spring-boot-starter-webflux | Cliente HTTP reactivo |

---

## 5. Verificar Modelos ML

Los modelos deben estar en `data-science/models/`:

```bash
ls data-science/models/
```

Archivos requeridos:
- `pipeline_sentimientos_español.pkl`
- `pipeline_sentimientos_ingles.pkl`

> Si faltan, contacta al equipo de Data Science.

---

## 6. Iniciar los Servicios

### Terminal 1: FastAPI (ML Service)
```bash
cd data-science/api
source venv/bin/activate  # Si usas venv
python3 -m uvicorn main:app --reload --port 8000
```

Verificar: http://localhost:8000/health

### Terminal 2: Spring Boot (Backend)
```bash
cd backend/sentiment-api

# Si es la primera vez, dar permisos:
chmod +x mvnw

# Iniciar servidor
./mvnw spring-boot:run

# Alternativa:
mvn spring-boot:run
```

Verificar: http://localhost:8080/api/health

### Terminal 3: Frontend (opcional)
```bash
cd frontend/public
python3 -m http.server 5500
```

Abrir: http://localhost:5500

---

## 7. Probar la API

### Con cURL
```bash
# Análisis de sentimiento
curl -X POST http://localhost:8080/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"Me encanta este producto","language":"es"}'

# Historial
curl http://localhost:8080/api/sentiment/history

# Estadísticas
curl http://localhost:8080/api/sentiment/statistics

# Registro de usuario
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456","email":"test@mail.com"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'
```

### Documentación Swagger
- FastAPI: http://localhost:8000/docs
- Spring Boot: http://localhost:8080/swagger-ui.html

---

## 8. Puertos Utilizados

| Servicio | Puerto | URL |
|----------|--------|-----|
| FastAPI (ML) | 8000 | http://localhost:8000 |
| Spring Boot | 8080 | http://localhost:8080 |
| Frontend | 5500 | http://localhost:5500 |
| H2 Console | 8080 | http://localhost:8080/h2-console |

---

## Troubleshooting

### Error: "Java version not compatible"
```bash
# Verificar versión
java -version

# Debe mostrar: openjdk version "17.x.x"
# Si no, instalar Java 17
```

### Error: "Module not found" (Python)
```bash
# Activar entorno virtual
source venv/bin/activate

# Reinstalar dependencias
pip install -r requirements.txt
```

### Error: "Pipeline español no encontrado"
```bash
# Verificar que existan los modelos
ls data-science/models/*.pkl
```

### Error: "Connection refused" en puerto 8080
```bash
# El backend no está corriendo
# Iniciar Spring Boot primero
cd backend/sentiment-api
./mvnw spring-boot:run
```

### Error: "503 Service Unavailable"
```bash
# FastAPI no está corriendo
# Iniciar FastAPI primero
cd data-science/api
python3 -m uvicorn main:app --reload --port 8000
```

---

## Estructura del Proyecto

```
hackathon-sentiment-analysis/
├── backend/sentiment-api/     # Java 17 + Spring Boot 3
├── data-science/
│   ├── api/                   # Python + FastAPI
│   ├── models/                # Modelos .pkl
│   └── datasets/              # CSVs de entrenamiento
├── frontend/public/           # HTML + JS + CSS
├── docs/                      # Documentación
└── README.md
```

---

## Contacto

- **Backend**: Equipo Backend
- **Data Science**: Equipo Data Science
- **Frontend**: Equipo Frontend

---

Última actualización: 2026-01-15
