# Instrucciones de Compilación y Prueba

## Prerequisitos

- Java 17 o superior
- Maven 3.6+
- Puerto 8080 disponible

Verificar versiones:
```bash
java -version
mvn -version
```

---

## Opción 1: Script Automático (Recomendado)

### Ejecutar script de compilación:

```bash
cd backend/sentiment-api
chmod +x compile-and-test.sh
./compile-and-test.sh
```

Este script:
1. Limpia builds anteriores
2. Compila el proyecto
3. Ejecuta tests
4. Empaqueta la aplicación
5. Guarda logs en `logs/compile-YYYYMMDD-HHMMSS.log`

---

## Opción 2: Comandos Manuales

### 1. Limpiar proyecto:
```bash
cd backend/sentiment-api
mvn clean
```

### 2. Compilar:
```bash
mvn compile
```

### 3. Ejecutar tests:
```bash
mvn test
```

### 4. Empaquetar (crear JAR):
```bash
mvn package
```

### 5. Compilar + Empaquetar (sin tests):
```bash
mvn clean package -DskipTests
```

---

## Ejecutar la Aplicación

### Modo desarrollo (con hot reload):
```bash
mvn spring-boot:run
```

### Modo producción (ejecutar JAR):
```bash
java -jar target/sentiment-api-0.0.1-SNAPSHOT.jar
```

La aplicación estará disponible en: `http://localhost:8080`

---

## Verificar que funciona

### 1. Swagger UI (Documentación):
```
http://localhost:8080/swagger-ui.html
```

### 2. Health Check:
```bash
curl http://localhost:8080/api/health
```

Respuesta esperada:
```json
{
  "status": "DEGRADED",
  "mlServiceStatus": "disconnected",
  "uptime": "10s",
  "timestamp": "2025-01-03T11:00:00"
}
```

### 3. Stats (base de datos vacía):
```bash
curl http://localhost:8080/api/stats
```

Respuesta esperada:
```json
{
  "total": 0,
  "positiveCount": 0,
  "negativeCount": 0,
  "neutralCount": 0,
  "positivePercentage": 0.0,
  "negativePercentage": 0.0,
  "neutralPercentage": 0.0,
  "averageProbabilityPositive": 0.0,
  "averageProbabilityNegative": 0.0,
  "averageProbabilityNeutral": 0.0
}
```

### 4. H2 Console (Base de datos):
```
http://localhost:8080/h2-console
```

Configuración:
- JDBC URL: `jdbc:h2:mem:sentimentdb`
- Username: `sa`
- Password: (dejar vacío)

---

## Solución de Problemas

### Error: "Port 8080 already in use"

**Solución 1:** Cambiar puerto en `application.properties`:
```properties
server.port=8081
```

**Solución 2:** Matar proceso en puerto 8080:
```bash
# Linux/Mac
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Error: "Cannot find symbol" o "package does not exist"

Limpiar y recompilar:
```bash
mvn clean install
```

### Error: "Tests failed"

Ejecutar sin tests:
```bash
mvn package -DskipTests
```

### Ver logs detallados:

```bash
mvn clean compile -X > logs/debug.log 2>&1
cat logs/debug.log
```

---

## Estructura de Logs

Los logs se guardan en `backend/sentiment-api/logs/`:

```
logs/
├── compile-20250103-110000.log
├── compile-20250103-120000.log
└── debug.log
```

### Ver último log:
```bash
ls -t logs/ | head -1 | xargs -I {} cat logs/{}
```

### Buscar errores en logs:
```bash
grep -i "error" logs/compile-*.log
```

### Buscar warnings:
```bash
grep -i "warning" logs/compile-*.log
```

---

## Tests Manuales

Después de compilar, ejecutar los tests del archivo:
```
TEST_ENDPOINTS.md
```

1. Iniciar aplicación: `mvn spring-boot:run`
2. Abrir `TEST_ENDPOINTS.md`
3. Ejecutar cada comando cURL
4. Marcar PASS/FAIL
5. Anotar errores en la sección de logs

---

## Próximos Pasos

Una vez compilado exitosamente:

1. Iniciar FastAPI (puerto 8000)
2. Probar endpoint `/api/sentiment` con predicciones reales
3. Verificar que se guarden en base de datos
4. Revisar estadísticas en `/api/stats`

---

## Comandos Útiles

### Ver dependencias:
```bash
mvn dependency:tree
```

### Actualizar dependencias:
```bash
mvn versions:display-dependency-updates
```

### Ver información del proyecto:
```bash
mvn help:effective-pom
```

### Generar documentación JavaDoc:
```bash
mvn javadoc:javadoc
```

Documentación en: `target/site/apidocs/index.html`
