# 🧠 Sentiment Analysis API – Backend

API REST desarrollada en **Spring Boot 3 + Java 17** para el análisis de sentimiento de texto.
Este backend expone un endpoint que recibe texto en formato JSON y retorna una predicción de sentimiento con su probabilidad.

Proyecto desarrollado como parte del **Hackathon ONE – Análisis de Sentimiento**.

---

## 🚀 Tecnologías utilizadas

- ☕ **Java 17**
- 🌱 **Spring Boot 3**
- 🌐 Spring Web
- ✅ Spring Validation (Jakarta Validation)
- 🗄️ Spring Data JPA
- 🧪 Base de datos **H2 en memoria** (modo desarrollo)
- 📦 Maven
- 🐱 IntelliJ IDEA

---

## 📂 Estructura del proyecto

sentiment-api
├── pom.xml
├── README.md
├── src
│ ├── main
│ │ ├── java
│ │ │ └── com.hackathon.sentiment
│ │ │ ├── SentimentApiApplication.java
│ │ │ ├── controller
│ │ │ │ └── SentimentController.java
│ │ │ ├── dto
│ │ │ │ ├── SentimentRequest.java
│ │ │ │ └── SentimentResponse.java
│ │ │ └── service
│ │ │ └── SentimentService.java
│ │ └── resources
│ │ └── application.properties
│ └── test
└── target

---

## ⚙️ Configuración y ejecución

### 1️⃣ Requisitos
- Java 17 instalado
- Maven (o usar `mvnw`)
- IntelliJ IDEA (recomendado)

### 2️⃣ Ejecutar la aplicación

Desde IntelliJ:
- Abrir `SentimentApiApplication`
- Click en ▶ **Run**

Desde terminal:
```bash
./mvnw spring-boot:run

La Aplicacion se levanta en:
http://localhost:8080


🔌 Endpoint disponible
▶ POST /api/sentiment

Analiza el sentimiento de un texto enviado.

📥 Request (JSON)
{
  "text": "Me encanta este proyecto"
}

📤 Response (200 OK)
{
  "prediction": "Positivo",
  "probability": 0.95
}

✅ Validaciones implementadas

El campo text es obligatorio

Longitud mínima de 3 caracteres

Manejo de errores HTTP:

400 Bad Request → Request inválido

404 Not Found → Endpoint incorrecto

405 Method Not Allowed → Método HTTP incorrecto


🧪 Base de datos (DEV)

H2 en memoria

Consola disponible en:

http://localhost:8080/h2-console


Configuración:

JDBC URL: jdbc:h2:mem:sentimentdb

Usuario: sa

Password: (vacío)

⚠️ Los datos se pierden al reiniciar la app (modo desarrollo).

🗺️ Roadmap (Backend)

 Crear proyecto Spring Boot

 Configurar validaciones

 Endpoint /api/sentiment

 Manejo de errores HTTP

 Persistencia de predicciones (opcional)

 Integración con modelo ML real

 Documentación con Swagger

👥 Equipo

Backend Lead / Arquitectura: ChatGPT 🤖

Backend Developer: Eduin (Ed) 🚀

📜 Licencia

Proyecto desarrollado con fines educativos y de hackathon.
Uso libre para aprendizaje y demostración.🧪 Base de datos (DEV)

H2 en memoria

Consola disponible en:

http://localhost:8080/h2-console


Configuración:

JDBC URL: jdbc:h2:mem:sentimentdb

Usuario: sa

Password: (vacío)

⚠️ Los datos se pierden al reiniciar la app (modo desarrollo).

🗺️ Roadmap (Backend)

 Crear proyecto Spring Boot

 Configurar validaciones

 Endpoint /api/sentiment

 Manejo de errores HTTP

 Persistencia de predicciones (opcional)

 Integración con modelo ML real

 Documentación con Swagger

👥 Equipo

Backend Lead / Arquitectura: ChatGPT 🤖

Backend Developer: Eduin (Ed) 🚀

📜 Licencia

Proyecto desarrollado con fines educativos y de hackathon.
Uso libre para aprendizaje y demostración.