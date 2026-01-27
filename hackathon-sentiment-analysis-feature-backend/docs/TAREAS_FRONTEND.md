# Tareas Pendientes del Frontend - Análisis de Sentimientos

**Fecha:** 2026-01-10
**Rama de trabajo:** `feature/backend`
**Backend disponible en:** `http://localhost:8080/api/sentiment`

---

## Estado Actual del Frontend

### ✅ Lo que YA está implementado:
- Interfaz básica con textarea para ingresar texto
- Botón de análisis
- Visualización del resultado (Positivo/Neutro/Negativo)
- Barra de progreso con probabilidad principal
- Colores diferenciados por sentimiento
- Loader durante análisis
- Manejo básico de errores
- Diseño con imagen de fondo y glassmorphism

### ❌ Lo que FALTA implementar:

---

## Tareas por Prioridad

### 🔴 ALTA PRIORIDAD (Crítico para funcionalidad completa)

#### Tarea 1: Implementar Selector de Idioma
**Responsable sugerido:** Desarrollador Frontend 1

**Descripción:**
Agregar un selector para que el usuario elija entre Español e Inglés antes de analizar el texto.

**Detalles técnicos:**
- Agregar un `<select>` o botones de radio con opciones:
  - Español (es)
  - English (en)
- Valor por defecto: Español ("es")
- El valor seleccionado debe enviarse en el body del POST a `/api/sentiment`:
  ```json
  {
    "text": "texto a analizar",
    "language": "es"  // <-- NUEVO campo requerido
  }
  ```

**Ubicación en HTML:**
Entre el título/descripción y el textarea

**Archivos a modificar:**
- `frontend/public/index.html` - Agregar selector
- `frontend/public/app.js` - Capturar valor y enviarlo en el body
- `frontend/public/styles.css` - Estilar el selector

---

#### Tarea 2: Mostrar Probabilidades Detalladas de las 3 Clases
**Responsable sugerido:** Desarrollador Frontend 2

**Descripción:**
El backend ahora retorna probabilidades para las 3 clases (Positivo, Neutro, Negativo). Mostrar estas probabilidades en lugar de solo una.

**Datos que retorna el backend:**
```json
{
  "prediction": "Positivo",
  "probability": 0.9952,
  "probabilitiesDetail": {
    "Negativo": 0.0002,
    "Neutro": 0.0047,
    "Positivo": 0.9952
  },
  "language": "es",
  "timestamp": "2026-01-10T14:15:00.760111"
}
```

**Qué mostrar:**
- Tabla o lista con las 3 probabilidades:
  ```
  Positivo: 99.52%  [Barra verde]
  Neutro:    0.47%  [Barra gris]
  Negativo:  0.02%  [Barra roja]
  ```
- Cada una con su propia barra de progreso coloreada

**Archivos a modificar:**
- `frontend/public/index.html` - Agregar estructura HTML para 3 barras
- `frontend/public/app.js` - Leer `probabilitiesDetail` y mostrar las 3 clases
- `frontend/public/styles.css` - Estilar las 3 barras

---

#### Tarea 3: Mostrar Idioma y Timestamp en el Resultado
**Responsable sugerido:** Desarrollador Frontend 1 o 2

**Descripción:**
Agregar campos adicionales en la sección de resultados para mostrar el idioma detectado y la fecha/hora del análisis.

**Qué mostrar:**
```
Predicción: Positivo
Idioma: Español
Fecha: 10/01/2026 14:15:00
Probabilidades:
  - Positivo: 99.52%
  - Neutro: 0.47%
  - Negativo: 0.02%
```

**Datos disponibles:**
- `language`: "es" o "en" (convertir a "Español" o "English")
- `timestamp`: "2026-01-10T14:15:00.760111" (formatear a legible)

**Archivos a modificar:**
- `frontend/public/index.html` - Agregar elementos para idioma y timestamp
- `frontend/public/app.js` - Extraer y formatear estos campos

---

### 🟡 MEDIA PRIORIDAD (Mejoras importantes)

#### Tarea 4: Crear Sección de Historial de Análisis
**Responsable sugerido:** Desarrollador Frontend 3

**Descripción:**
Mostrar los últimos 10 análisis realizados usando el endpoint GET `/api/sentiment/history`

**Endpoint disponible:**
```bash
GET http://localhost:8080/api/sentiment/history
```

**Respuesta del backend:**
```json
[
  {
    "id": 5,
    "text": "Me encanta este servicio",
    "prediction": "Positivo",
    "probability": 0.9905,
    "createdAt": "2026-01-10T15:39:26.516725"
  },
  {
    "id": 4,
    "text": "El producto es normal",
    "prediction": "Neutro",
    "probability": 0.9903,
    "createdAt": "2026-01-10T15:39:13.506517"
  }
]
```

**Qué implementar:**
1. Botón o tab "Ver Historial"
2. Al hacer clic, fetch a `/api/sentiment/history`
3. Mostrar tabla o lista con:
   - Texto analizado (truncado si es muy largo)
   - Predicción (con color)
   - Probabilidad
   - Fecha

**Archivos a modificar:**
- `frontend/public/index.html` - Agregar sección de historial
- `frontend/public/app.js` - Función para cargar y mostrar historial
- `frontend/public/styles.css` - Estilar tabla/lista de historial

---

#### Tarea 5: Crear Dashboard de Estadísticas
**Responsable sugerido:** Desarrollador Frontend 4

**Descripción:**
Mostrar estadísticas generales usando el endpoint GET `/api/sentiment/statistics`

**Endpoint disponible:**
```bash
GET http://localhost:8080/api/sentiment/statistics
```

**Respuesta del backend:**
```json
{
  "Positivo": 3,
  "Neutro": 1,
  "Negativo": 1
}
```

**Qué implementar:**
1. Sección de estadísticas con tarjetas o gráfico
2. Mostrar conteo de cada sentimiento:
   ```
   📊 Estadísticas
   Positivos: 3
   Neutros: 1
   Negativos: 1
   Total: 5
   ```
3. Opcional: Gráfico de barras o pastel (usar Chart.js o similar)

**Archivos a modificar:**
- `frontend/public/index.html` - Agregar sección de estadísticas
- `frontend/public/app.js` - Función para cargar estadísticas
- `frontend/public/styles.css` - Estilar estadísticas

**Librería sugerida (opcional):**
- Chart.js: https://www.chartjs.org/

---

#### Tarea 6: Implementar Filtro por Sentimiento en Historial
**Responsable sugerido:** Desarrollador Frontend 3

**Descripción:**
Permitir filtrar el historial por tipo de sentimiento (Positivo, Neutro, Negativo)

**Endpoints disponibles:**
```bash
GET http://localhost:8080/api/sentiment/history/Positivo
GET http://localhost:8080/api/sentiment/history/Neutro
GET http://localhost:8080/api/sentiment/history/Negativo
```

**Qué implementar:**
1. Botones o tabs: "Todos" | "Positivos" | "Neutros" | "Negativos"
2. Al hacer clic en un filtro, cargar solo ese tipo
3. Actualizar la vista del historial

**Archivos a modificar:**
- `frontend/public/index.html` - Agregar botones de filtro
- `frontend/public/app.js` - Implementar lógica de filtrado
- `frontend/public/styles.css` - Estilar botones de filtro

---

### 🟢 BAJA PRIORIDAD (Mejoras opcionales/pulido)

#### Tarea 7: Validación Avanzada en Frontend
**Responsable sugerido:** Cualquier desarrollador disponible

**Descripción:**
Mejorar las validaciones antes de enviar al backend.

**Validaciones a agregar:**
- Texto mínimo: 5 caracteres (mostrar mensaje de error)
- Texto máximo: 5000 caracteres (mostrar contador y límite)
- Deshabilitar botón "Analizar" si no cumple requisitos
- Mostrar mensajes de error claros y profesionales

**Archivos a modificar:**
- `frontend/public/app.js` - Agregar validaciones
- `frontend/public/index.html` - Agregar elementos para mensajes de error
- `frontend/public/styles.css` - Estilar mensajes de error

---

#### Tarea 8: Mejorar Manejo de Errores
**Responsable sugerido:** Cualquier desarrollador disponible

**Descripción:**
Mostrar mensajes de error específicos según el tipo de error del backend.

**Errores del backend:**
- 400: Request inválido
- 422: Validación fallida (texto muy corto, idioma inválido)
- 503: Servicio ML no disponible

**Qué implementar:**
- Capturar el código de error y mensaje del backend
- Mostrar mensaje específico al usuario
- Ejemplo: "El texto debe tener al menos 5 caracteres"

**Archivos a modificar:**
- `frontend/public/app.js` - Mejorar función `showError()`

---

#### Tarea 9: Agregar Botón de Refrescar Historial/Estadísticas
**Responsable sugerido:** Desarrollador Frontend 3 o 4

**Descripción:**
Agregar botones para actualizar historial y estadísticas sin recargar la página.

**Qué implementar:**
- Botón "🔄 Refrescar" en sección de historial
- Botón "🔄 Actualizar" en sección de estadísticas
- Al hacer clic, hacer fetch nuevamente y actualizar vista

**Archivos a modificar:**
- `frontend/public/index.html` - Agregar botones
- `frontend/public/app.js` - Implementar funciones de refresh
- `frontend/public/styles.css` - Estilar botones

---

#### Tarea 10: Responsive Design
**Responsable sugerido:** Desarrollador con experiencia en CSS

**Descripción:**
Asegurar que la interfaz se vea bien en móviles y tablets.

**Qué revisar:**
- Container principal debe adaptarse a pantallas pequeñas
- Historial debe ser scrolleable en móviles
- Botones y selector de idioma deben ser táctiles
- Texto y fuentes legibles en móvil

**Archivos a modificar:**
- `frontend/public/styles.css` - Agregar media queries

---

#### Tarea 11: Correcciones de Texto
**Responsable sugerido:** Cualquier desarrollador

**Descripción:**
Corregir errores de ortografía en el HTML.

**Errores encontrados:**
- `<h1>Analizis de sentimiento</h1>` → `<h1>Análisis de sentimiento</h1>`
- Revisar textos descriptivos

**Archivos a modificar:**
- `frontend/public/index.html`

---

## Resumen de Archivos que se Modificarán

| Archivo | Tareas que lo modifican |
|---------|-------------------------|
| `frontend/public/index.html` | 1, 2, 3, 4, 5, 6, 7, 9, 11 |
| `frontend/public/app.js` | 1, 2, 3, 4, 5, 6, 7, 8, 9 |
| `frontend/public/styles.css` | 1, 2, 4, 5, 6, 7, 9, 10 |

---

## Distribución Sugerida de Tareas

### Desarrollador Frontend 1
- ✅ Tarea 1: Selector de idioma (ALTA)
- ✅ Tarea 3: Mostrar idioma y timestamp (ALTA)
- 🟡 Tarea 11: Correcciones de texto (BAJA)

### Desarrollador Frontend 2
- ✅ Tarea 2: Probabilidades detalladas (ALTA)
- 🟡 Tarea 7: Validación avanzada (BAJA)

### Desarrollador Frontend 3
- 🟡 Tarea 4: Historial de análisis (MEDIA)
- 🟡 Tarea 6: Filtro por sentimiento (MEDIA)
- 🟡 Tarea 9: Botón refrescar historial (BAJA)

### Desarrollador Frontend 4
- 🟡 Tarea 5: Dashboard de estadísticas (MEDIA)
- 🟡 Tarea 9: Botón refrescar estadísticas (BAJA)

### Desarrollador con CSS
- 🟡 Tarea 10: Responsive design (BAJA)

### Cualquiera disponible
- 🟡 Tarea 8: Mejorar manejo de errores (BAJA)

---

## Notas Importantes

### ⚠️ Puerto del Backend
- **Para la mayoría de colaboradores:** Usar `http://localhost:8080/api/sentiment`
- **Solo para el colaborador con problemas de puerto:** Cambiar a `http://localhost:8081/api/sentiment` en su copia local
- **NO subir** cambios de puerto a la rama compartida

### 🔗 Endpoints Disponibles del Backend

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/sentiment` | Analizar sentimiento |
| GET | `/api/sentiment/history` | Últimos 10 análisis |
| GET | `/api/sentiment/history/{prediction}` | Filtrar por sentimiento |
| GET | `/api/sentiment/statistics` | Estadísticas generales |

### 📝 Formato del Request POST
```json
{
  "text": "texto a analizar (min 5, max 5000 caracteres)",
  "language": "es"  // "es" o "en", por defecto "es"
}
```

### 📝 Formato del Response POST
```json
{
  "prediction": "Positivo",
  "probability": 0.9952,
  "probabilitiesDetail": {
    "Negativo": 0.0002,
    "Neutro": 0.0047,
    "Positivo": 0.9952
  },
  "language": "es",
  "timestamp": "2026-01-10T14:15:00.760111"
}
```

---

## Testing

Cada desarrollador debe probar su funcionalidad:

1. **Iniciar servicios locales:**
   ```bash
   # Terminal 1: FastAPI
   cd data-science/api
   python3 -m uvicorn main:app --reload --port 8000

   # Terminal 2: Spring Boot
   cd backend/sentiment-api
   ./mvnw spring-boot:run
   ```

2. **Probar su funcionalidad específica**
3. **Verificar que no rompe funcionalidades existentes**
4. **Probar en diferentes navegadores (Chrome, Firefox)**

---

## Coordinación

- **Rama de trabajo:** `feature/backend`
- **Antes de empezar:** Hacer `git pull` para tener últimos cambios
- **Commits:** Mensajes claros describiendo la tarea
- **Conflictos:** Si dos personas modifican el mismo archivo, coordinar para resolver

---

## Recursos Útiles

- **Documentación del Backend:** Ver archivo `CAMBIOS_IMPLEMENTACION.md`
- **Guía de Testing:** Ver archivo `TESTING_GUIDE.md`
- **Fetch API:** https://developer.mozilla.org/es/docs/Web/API/Fetch_API
- **Chart.js (opcional para estadísticas):** https://www.chartjs.org/

---

## Preguntas Frecuentes

**P: ¿Puedo usar librerías JavaScript adicionales?**
R: Sí, pero preferiblemente vanilla JavaScript. Si usas librerías, documentarlo.

**P: ¿Qué hago si el backend no responde?**
R: Verificar que FastAPI (puerto 8000) y Spring Boot (puerto 8080) estén corriendo.

**P: ¿Dónde reporto problemas?**
R: Comunicar al equipo o crear un issue en el repositorio.

**P: ¿Puedo cambiar el diseño visual?**
R: Sí, siempre que mantenga la funcionalidad y sea profesional.

---

**Última actualización:** 2026-01-10
**Documento creado por:** Claude Sonnet 4.5
