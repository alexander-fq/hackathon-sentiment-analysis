# 🧠 Sentiment Analysis API – Backend

API REST desarrollada en **Spring Boot 3 + Java 17** para el análisis de sentimiento de texto con sistema de autenticación completo.

Proyecto desarrollado como parte del **Hackathon ONE – Análisis de Sentimiento**.

---

## 🚀 Tecnologías utilizadas

- ☕ **Java 17**
- 🌱 **Spring Boot 3**
- 🔐 **Spring Security 6**
- 🌐 Spring Web
- ✅ Spring Validation (Jakarta Validation)
- 🗄️ Spring Data JPA
- 💾 Base de datos **H2 persistente** (archivo local)
- 🔒 BCrypt para encriptación de contraseñas
- 📦 Maven
- 🎨 Frontend con Tailwind CSS

---

## 📂 Estructura del proyecto

```
sentiment-api/
├── pom.xml
├── README.md
├── src/
│   ├── main/
│   │   ├── java/com/hackathon/sentiment/
│   │   │   ├── SentimentApiApplication.java
│   │   │   ├── controller/
│   │   │   │   ├── SentimentController.java
│   │   │   │   └── AuthController.java          ✨ NUEVO
│   │   │   ├── entity/
│   │   │   │   └── User.java                    ✨ NUEVO
│   │   │   ├── dto/
│   │   │   │   ├── SentimentRequest.java
│   │   │   │   ├── SentimentResponse.java
│   │   │   │   ├── AuthRequest.java             ✨ NUEVO
│   │   │   │   └── AuthResponse.java            ✨ NUEVO
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java          ✨ NUEVO
│   │   │   ├── service/
│   │   │   │   ├── SentimentService.java
│   │   │   │   └── UserService.java             ✨ NUEVO
│   │   │   └── config/
│   │   │       └── SecurityConfig.java          ✨ NUEVO
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/                          ✨ NUEVO
│   │           ├── index.html
│   │           ├── register.html
│   │           ├── login.html
│   │           └── dashboard.html
│   └── test/
└── data/                                         ✨ NUEVO
    └── sentimentdb.mv.db (base de datos persistente)
```

---

## ⚙️ Configuración y ejecución

### 1️⃣ Requisitos
- Java 17 instalado
- Maven (incluido mvnw.cmd)

### 2️⃣ Ejecutar la aplicación

Desde terminal (Windows):
```bash
cd backend/sentiment-api
.\mvnw.cmd spring-boot:run
```

Desde terminal (Linux/Mac):
```bash
cd backend/sentiment-api
./mvnw spring-boot:run
```

La aplicación se levanta en: **http://localhost:8080**

---

## 🔌 Endpoints disponibles

### 🔐 Autenticación

#### POST /api/auth/register
Registra un nuevo usuario.

**Request:**
```json
{
  "username": "usuario",
  "email": "usuario@example.com",
  "password": "miPassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "dXN1YXJpbzoxOjE3MzY5NjU0MzIxMjM=",
  "userId": 1,
  "username": "usuario"
}
```

#### POST /api/auth/login
Inicia sesión con credenciales.

**Request:**
```json
{
  "username": "usuario",
  "password": "miPassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "token": "dXN1YXJpbzoxOjE3MzY5NjU0MzIxMjM=",
  "userId": 1,
  "username": "usuario"
}
```

#### GET /api/auth/health
Verifica que el servicio esté funcionando.

**Response:** `Auth service is running`

---

### 📊 Análisis de Sentimientos

#### POST /api/sentiment
Analiza el sentimiento de un texto enviado.

**Request:**
```json
{
  "text": "Me encanta este proyecto"
}
```

**Response (200 OK):**
```json
{
  "prediction": "Positivo",
  "probability": 0.95
}
```

---

## ✅ Validaciones implementadas

- El campo text es obligatorio
- Longitud mínima de 3 caracteres
- Manejo de errores HTTP:
  - **400 Bad Request** → Request inválido
  - **404 Not Found** → Endpoint incorrecto
  - **405 Method Not Allowed** → Método HTTP incorrecto

---

## 💾 Base de datos H2

### Configuración

La base de datos H2 está configurada en **modo persistente** (archivo local).

**Ubicación:** `./data/sentimentdb.mv.db`

### Acceso a H2 Console

1. Ir a: **http://localhost:8080/h2-console**
2. Configurar:
   - **JDBC URL**: `jdbc:h2:file:./data/sentimentdb;MODE=MySQL;AUTO_SERVER=TRUE`
   - **Username**: `sa`
   - **Password**: *(dejar vacío)*
3. Click en **Connect**

### Consultas útiles

```sql
-- Ver todos los usuarios
SELECT * FROM users;

-- Ver usuario específico
SELECT * FROM users WHERE username = 'usuario';

-- Contar usuarios
SELECT COUNT(*) FROM users;
```

---

## 🌐 Frontend

### Páginas disponibles

- **Inicio**: http://localhost:8080
- **Registro**: http://localhost:8080/register.html
- **Login**: http://localhost:8080/login.html
- **Dashboard**: http://localhost:8080/dashboard.html (requiere autenticación)

### Flujo de usuario

1. Usuario accede a la página de inicio
2. Click en **Registrarse**
3. Completa el formulario (username, email, password)
4. Sistema valida y crea usuario con contraseña encriptada
5. Redirección automática al Dashboard
6. Usuario puede cerrar sesión y volver a hacer login

---

## 🔐 Seguridad

- **Contraseñas encriptadas** con BCryptPasswordEncoder
- **Spring Security 6** con SecurityFilterChain
- **CORS configurado** para desarrollo local
- **Tokens simples** en Base64 (username:userId:timestamp)
- **Validaciones** en backend y frontend

---

## 🧪 Testing con cURL

### Registrar usuario
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123"}'
```

---

## 🗺️ Roadmap

### ✅ Completado
- [x] Crear proyecto Spring Boot
- [x] Configurar validaciones
- [x] Endpoint /api/sentiment
- [x] Manejo de errores HTTP
- [x] **Sistema de autenticación completo**
- [x] **Base de datos H2 persistente**
- [x] **Frontend con registro y login**
- [x] **Spring Security 6**

### 🔄 Próximas mejoras
- [ ] Implementar JWT (JSON Web Tokens)
- [ ] Agregar refresh tokens
- [ ] Validación de email mediante enlace
- [ ] Recuperación de contraseña
- [ ] Roles y permisos (ADMIN, USER)
- [ ] Integración con modelo ML real
- [ ] Documentación con Swagger
- [ ] Migrar a PostgreSQL en producción

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