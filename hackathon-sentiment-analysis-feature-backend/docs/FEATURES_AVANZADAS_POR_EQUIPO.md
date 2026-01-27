# Features Avanzadas por Equipo - Basadas en Analitic 3.5

**Fecha:** 2026-01-12
**Proyecto Base de Referencia:** Analitic 3.5
**Objetivo:** Implementar funcionalidades avanzadas distribuidas por equipo

---

## Índice
1. [Equipo Backend](#equipo-backend)
2. [Equipo Data Science](#equipo-data-science)
3. [Equipo Frontend](#equipo-frontend)
4. [Priorización General](#priorización-general)

---

## Equipo Backend

### Responsabilidades Principales
- API REST endpoints
- Integración con servicios externos
- Sistema de exportación
- Sistema de notificaciones
- Gestión de base de datos
- Seguridad y autenticación

---

### 🔴 ALTA PRIORIDAD

#### Feature 1: Sistema de Exportación Multicapa
**Descripción:** Exportar análisis en múltiples formatos con datos estructurados

**Funcionalidad:**
- Exportación a Excel (.xlsx) con 6 hojas:
  1. **Reviews** - Datos brutos con análisis
  2. **Análisis** - Estadísticas por sentimiento
  3. **Resumen** - KPIs ejecutivos
  4. **Tendencias** - Series temporales
  5. **Alertas** - Eventos críticos
  6. **Insights** - Descubrimientos automáticos
- Exportación a CSV (formato tabular)
- Exportación a JSON (formato estructurado)

**Endpoints Necesarios:**
```javascript
POST /api/export/excel
POST /api/export/csv
POST /api/export/json
GET  /api/export/download/:fileId
```

**Dependencias:**
```json
{
  "xlsx": "^0.18.5",
  "csv-writer": "^1.6.0"
}
```

**Archivos a Crear:**
- `backend/sentiment-api/src/main/java/com/hackathon/sentiment/controller/ExportController.java`
- `backend/sentiment-api/src/main/java/com/hackathon/sentiment/service/ExportService.java`
- `backend/sentiment-api/src/main/java/com/hackathon/sentiment/dto/ExportRequest.java`

**Tiempo Estimado:** 2-3 días

---

#### Feature 2: Sistema de Alertas Inteligentes
**Descripción:** Detectar automáticamente situaciones críticas y generar alertas

**Tipos de Alertas:**
1. **Producto con peor sentimiento**
   - Detectar automáticamente el producto/categoría con más comentarios negativos

2. **Cambio de tendencia negativa**
   - Comparar sentimiento actual vs periodo anterior
   - Alertar si hay caída significativa (>20%)

3. **Anomalías detectadas**
   - Reviews con sentimiento extremo
   - Patrones inusuales en volumen

4. **Umbral de confianza bajo**
   - Alertar cuando el modelo tiene baja confianza (<70%)

**Endpoints Necesarios:**
```java
GET  /api/alerts
POST /api/alerts/configure
GET  /api/alerts/statistics
```

**Base de Datos:**
```sql
CREATE TABLE alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    alert_type VARCHAR(50),
    severity VARCHAR(20),
    title VARCHAR(200),
    description TEXT,
    metadata JSON,
    created_at TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE
);
```

**Archivos a Crear:**
- `Alert.java` (Entity)
- `AlertRepository.java`
- `AlertService.java`
- `AlertController.java`

**Tiempo Estimado:** 2 días

---

#### Feature 3: Sistema de Notificaciones Multi-canal
**Descripción:** Enviar notificaciones de alertas por diferentes canales

**Canales Soportados:**
1. **Email** (Nodemailer / JavaMail)
   - HTML templates
   - Adjuntar reportes

2. **Webhooks**
   - POST a URL configurada
   - Payload JSON estándar
   - Validación HMAC-SHA256

3. **Slack** (opcional)
   - Integración con Incoming Webhooks
   - Mensajes con formato

**Endpoints Necesarios:**
```java
POST /api/notifications/email
POST /api/notifications/webhook
POST /api/notifications/test
GET  /api/notifications/config
PUT  /api/notifications/config
```

**Archivos a Crear:**
- `NotificationService.java`
- `NotificationController.java`
- `EmailService.java`
- `WebhookService.java`

**Dependencias Spring Boot:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

**Tiempo Estimado:** 2-3 días

---

### 🟡 MEDIA PRIORIDAD

#### Feature 4: Métricas Empresariales (NPS, CSAT, CES)
**Descripción:** Calcular métricas estándar de satisfacción del cliente

**Métricas:**

1. **NPS (Net Promoter Score)**
   - Fórmula: (% Promotores - % Detractores)
   - Escala: -100 a +100
   - Clasificación:
     - Promotores: Positivo con probabilidad > 80%
     - Pasivos: Neutro
     - Detractores: Negativo

2. **CSAT (Customer Satisfaction)**
   - Fórmula: (Reviews Positivos / Total) * 100
   - Escala: 0-100%

3. **CES (Customer Effort Score)**
   - Basado en palabras clave de esfuerzo
   - Palabras positivas: fácil, simple, rápido
   - Palabras negativas: difícil, complicado, lento

4. **Health Score**
   - Combinación ponderada de NPS + CSAT + Sentimiento
   - Escala: 0-100

**Endpoints Necesarios:**
```java
GET /api/metrics/nps
GET /api/metrics/csat
GET /api/metrics/ces
GET /api/metrics/health-score
GET /api/metrics/all
```

**Archivos a Crear:**
- `MetricsService.java`
- `MetricsController.java`
- `MetricsResponse.java`

**Tiempo Estimado:** 1-2 días

---

#### Feature 5: Sistema de Comparación
**Descripción:** Comparar análisis entre diferentes periodos o proyectos

**Funcionalidad:**
- Comparar periodo actual vs anterior
- Comparar múltiples categorías
- Benchmarking con datos históricos

**Endpoints Necesarios:**
```java
POST /api/compare/periods
POST /api/compare/categories
GET  /api/compare/benchmark
```

**Tiempo Estimado:** 1-2 días

---

### 🟢 BAJA PRIORIDAD

#### Feature 6: Sistema de Caché con Redis
**Descripción:** Cachear resultados frecuentes para mejorar performance

**Funcionalidad:**
- Cachear análisis de sentimientos
- Cachear estadísticas del dashboard
- TTL configurable (15 minutos default)

**Dependencias:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

**Tiempo Estimado:** 1 día

---

#### Feature 7: Tareas Programadas (Cron Jobs)
**Descripción:** Ejecutar tareas automáticas periódicamente

**Tareas:**
- Generar reportes diarios automáticos
- Calcular métricas semanales
- Limpiar datos antiguos
- Enviar resumen por email

**Configuración:**
```java
@Scheduled(cron = "0 0 8 * * ?") // Todos los días a las 8 AM
public void generateDailyReport() {
    // Lógica
}
```

**Tiempo Estimado:** 1 día

---

## Equipo Data Science

### Responsabilidades Principales
- Mejora de modelos ML
- Análisis NLP avanzado
- Detección de patrones
- Generación de insights

---

### 🔴 ALTA PRIORIDAD

#### Feature 1: Análisis de Emociones (6 emociones)
**Descripción:** Detectar emociones específicas además del sentimiento general

**Emociones a Detectar:**
1. **Joy (Alegría)** - feliz, contento, alegre, genial, excelente
2. **Anger (Cólera)** - enojado, furioso, molesto, irritado
3. **Fear (Miedo)** - miedo, temor, asustado, preocupado
4. **Sadness (Tristeza)** - triste, deprimido, decepcionado
5. **Surprise (Sorpresa)** - sorprendido, inesperado, asombrado
6. **Disgust (Asco)** - asco, repugnante, desagradable

**Implementación:**
- Diccionario de palabras por emoción (50+ palabras cada una)
- Scoring por frecuencia de palabras
- Emoción dominante + score (0-100)

**API Endpoint:**
```python
POST /predict
{
  "text": "...",
  "language": "es",
  "include_emotions": true
}

Response:
{
  "prevision": "Positivo",
  "probabilidad": 0.95,
  "emociones": {
    "joy": 0.85,
    "anger": 0.05,
    "fear": 0.02,
    "sadness": 0.03,
    "surprise": 0.15,
    "disgust": 0.01
  },
  "emocion_dominante": "joy"
}
```

**Archivos a Modificar:**
- `data-science/api/main.py`
- Crear: `data-science/api/emotions.py`

**Tiempo Estimado:** 2 días

---

#### Feature 2: Detección de Sarcasmo
**Descripción:** Identificar cuando un comentario es sarcástico

**Patrones de Sarcasmo:**
1. Palabras positivas + contexto negativo
   - "qué bueno que..." (negativo)
   - "me encanta cuando..." (negativo)

2. Uso excesivo de signos
   - "Excelente!!!!!!"
   - "Perfecto... justo lo que necesitaba..."

3. Palabras clave
   - "obviamente", "claro que sí", "por supuesto"

4. Contradicciones
   - "Bueno pero malo"
   - "Perfecto excepto que..."

**Response:**
```json
{
  "prevision": "Negativo",
  "probabilidad": 0.82,
  "sarcasmo_detectado": true,
  "confianza_sarcasmo": 0.75,
  "patron_identificado": "palabras_positivas_contexto_negativo"
}
```

**Archivos a Crear:**
- `data-science/api/sarcasm_detector.py`

**Tiempo Estimado:** 2 días

---

#### Feature 3: Extracción Automática de Keywords
**Descripción:** Identificar palabras clave más relevantes usando TF-IDF

**Funcionalidad:**
- Tokenización del texto
- Cálculo TF-IDF
- Top N keywords (5-10)
- Keywords por sentimiento

**Implementación:**
```python
from sklearn.feature_extraction.text import TfidfVectorizer

def extract_keywords(texts, top_n=10):
    vectorizer = TfidfVectorizer(
        max_features=100,
        ngram_range=(1, 2),
        stop_words='spanish'
    )
    tfidf = vectorizer.fit_transform(texts)
    # Obtener top keywords
    return keywords
```

**Endpoint:**
```python
POST /extract-keywords
{
  "texts": ["texto1", "texto2", ...],
  "top_n": 10
}

Response:
{
  "keywords": [
    {"word": "excelente", "score": 0.95},
    {"word": "calidad", "score": 0.87},
    {"word": "buen servicio", "score": 0.82}
  ]
}
```

**Dependencias:**
```bash
pip install scikit-learn
```

**Tiempo Estimado:** 1-2 días

---

### 🟡 MEDIA PRIORIDAD

#### Feature 4: Clustering de Reviews (K-means)
**Descripción:** Agrupar reviews similares automáticamente

**Funcionalidad:**
- Vectorización con TF-IDF
- Clustering K-means (3-5 clusters)
- Identificación de temas por cluster

**Implementación:**
```python
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer

def cluster_reviews(texts, n_clusters=3):
    vectorizer = TfidfVectorizer(max_features=100)
    X = vectorizer.fit_transform(texts)

    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    labels = kmeans.fit_predict(X)

    return labels, kmeans
```

**Endpoint:**
```python
POST /cluster
{
  "texts": [...],
  "n_clusters": 3
}

Response:
{
  "clusters": [
    {
      "cluster_id": 0,
      "size": 45,
      "tema_principal": "Calidad del producto",
      "keywords": ["calidad", "producto", "excelente"]
    },
    ...
  ]
}
```

**Tiempo Estimado:** 2 días

---

#### Feature 5: Detección de Anomalías
**Descripción:** Identificar reviews con patrones inusuales

**Tipos de Anomalías:**
1. **Sentimiento extremo** (probabilidad > 95%)
2. **Longitud anormal** (muy corto <10 chars o muy largo >1000 chars)
3. **Patrón inusual de palabras**

**Implementación:**
```python
def detect_anomalies(reviews):
    anomalies = []
    for review in reviews:
        if review['probability'] > 0.95:
            anomalies.append({
                'type': 'extreme_sentiment',
                'review': review
            })
    return anomalies
```

**Tiempo Estimado:** 1 día

---

#### Feature 6: Análisis de Entidades (NER)
**Descripción:** Extraer entidades del texto (productos, servicios, precios)

**Entidades a Detectar:**
- **Productos** - nombres de productos mencionados
- **Servicios** - tipos de servicio
- **Precios** - menciones de costos
- **Calidad** - adjetivos de calidad

**Dependencias:**
```bash
pip install spacy
python -m spacy download es_core_news_sm
```

**Tiempo Estimado:** 2 días

---

### 🟢 BAJA PRIORIDAD

#### Feature 7: Predicción de Tendencias
**Descripción:** Predecir sentimiento futuro basado en datos históricos

**Funcionalidad:**
- Análisis de series temporales
- Predicción 7 días adelante
- Detección de estacionalidad

**Tiempo Estimado:** 2-3 días

---

#### Feature 8: Análisis Multilingüe Mejorado
**Descripción:** Soporte para más idiomas (Francés, Alemán, Portugués)

**Tiempo Estimado:** 1-2 días por idioma

---

## Equipo Frontend

### Responsabilidades Principales
- Interfaz de usuario
- Visualizaciones
- Dashboard interactivo
- Integración con Backend

---

### 🔴 ALTA PRIORIDAD

#### Feature 1: Dashboard Avanzado con Visualizaciones
**Descripción:** Dashboard ejecutivo con múltiples gráficos y KPIs

**Componentes del Dashboard:**

1. **Tarjetas de KPIs** (4 tarjetas)
   - Total de Reviews
   - Rating Promedio
   - Sentimiento General (Positivo %)
   - NPS Score

2. **Gráfico de Tendencias** (Chart.js)
   - Línea de tiempo (últimos 30 días)
   - 3 líneas: Positivo, Neutro, Negativo
   - Eje X: Fechas
   - Eje Y: Cantidad de reviews

3. **Distribución de Sentimientos** (Pastel)
   - 3 sectores: Positivo, Neutro, Negativo
   - Colores: Verde, Gris, Rojo
   - Porcentajes

4. **Top Productos/Categorías** (Barras horizontales)
   - Top 5 productos por volumen
   - Color según sentimiento promedio

5. **Reviews Recientes** (Tabla)
   - Últimos 10 análisis
   - Texto truncado (100 chars)
   - Badge de sentimiento
   - Timestamp

**Página a Crear:**
- `frontend/public/dashboard.html`

**Módulos JavaScript:**
- `frontend/public/js/modules/dashboard.js`
- `frontend/public/js/modules/charts.js`

**Librerías Necesarias:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
```

**Tiempo Estimado:** 3-4 días

---

#### Feature 2: Página de Exportación
**Descripción:** Interfaz para exportar análisis en diferentes formatos

**Componentes:**

1. **Selector de Formato**
   - Radio buttons: Excel, CSV, JSON
   - Ícono visual por formato

2. **Filtros de Exportación**
   - Rango de fechas (datepicker)
   - Filtro por sentimiento
   - Filtro por categoría

3. **Vista Previa**
   - Mostrar primeros 10 registros
   - Tabla con datos que se exportarán

4. **Botón de Descarga**
   - Botón grande con ícono de descarga
   - Loading spinner durante generación
   - Descarga automática al completar

**Página a Crear:**
- `frontend/public/exports.html`

**JavaScript:**
```javascript
async function exportData(format) {
    const filters = {
        format: format,
        dateFrom: document.getElementById('dateFrom').value,
        dateTo: document.getElementById('dateTo').value,
        sentiment: document.getElementById('sentiment').value
    };

    const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analisis_sentimientos.${format}`;
    a.click();
}
```

**Tiempo Estimado:** 2 días

---

#### Feature 3: Sistema de Alertas en UI
**Descripción:** Visualización de alertas críticas en tiempo real

**Componentes:**

1. **Badge de Notificaciones**
   - Ícono de campana en navbar
   - Badge con número de alertas sin leer
   - Color rojo si hay críticas

2. **Dropdown de Alertas**
   - Últimas 5 alertas
   - Título, descripción, timestamp
   - Botón "Ver todas"

3. **Página de Alertas**
   - Lista completa de alertas
   - Filtros: Tipo, Severidad, Fecha
   - Marcar como leída/resuelta
   - Tabla con paginación

**HTML Estructura:**
```html
<div class="notifications-dropdown">
    <button class="notification-bell">
        <i class="fas fa-bell"></i>
        <span class="badge">3</span>
    </button>
    <div class="dropdown-content">
        <div class="alert-item critical">
            <h4>Cambio de tendencia negativa</h4>
            <p>El sentimiento ha caído 25% en las últimas 24h</p>
            <span class="time">Hace 5 minutos</span>
        </div>
        <!-- más alertas -->
    </div>
</div>
```

**Páginas a Crear:**
- Componente en `index.html` (navbar)
- `frontend/public/alerts.html`

**Tiempo Estimado:** 2 días

---

#### Feature 4: Gráfico de Emociones (Radar Chart)
**Descripción:** Visualizar las 6 emociones detectadas

**Implementación:**
```javascript
const emotionsChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['Alegría', 'Cólera', 'Miedo', 'Tristeza', 'Sorpresa', 'Asco'],
        datasets: [{
            label: 'Emociones Detectadas',
            data: [0.85, 0.05, 0.02, 0.03, 0.15, 0.01],
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)'
        }]
    },
    options: {
        scales: {
            r: {
                min: 0,
                max: 1,
                ticks: { stepSize: 0.2 }
            }
        }
    }
});
```

**Ubicación:**
- Agregar a página de análisis individual

**Tiempo Estimado:** 1 día

---

### 🟡 MEDIA PRIORIDAD

#### Feature 5: Página de Métricas Empresariales
**Descripción:** Visualización de NPS, CSAT, CES y Health Score

**Componentes:**

1. **Tarjetas de Métricas**
   - NPS Score con gauge
   - CSAT con barra de progreso
   - CES con indicador
   - Health Score con color (verde/amarillo/rojo)

2. **Gráfico de Evolución**
   - Línea de tiempo de cada métrica
   - Últimos 3 meses

3. **Comparativa con Benchmarks**
   - Tabla comparativa
   - Tu Score vs Industria

**Página a Crear:**
- `frontend/public/metrics.html`

**Ejemplo Gauge Chart:**
```javascript
const npsGauge = new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [npsScore + 100, 200 - (npsScore + 100)],
            backgroundColor: ['#4CAF50', '#e0e0e0']
        }]
    },
    options: {
        circumference: 180,
        rotation: 270,
        cutout: '75%'
    }
});
```

**Tiempo Estimado:** 2-3 días

---

#### Feature 6: Página de Comparación
**Descripción:** Comparar análisis entre periodos o categorías

**Componentes:**

1. **Selector de Comparación**
   - Dropdown: Periodos, Categorías, Proyectos

2. **Selector de Elementos**
   - Periodo 1 vs Periodo 2 (datepickers)
   - Categoría 1 vs Categoría 2 (dropdowns)

3. **Gráficos Comparativos**
   - Barras lado a lado
   - Tabla de diferencias
   - Indicadores de cambio (↑ ↓)

**Página a Crear:**
- `frontend/public/compare.html`

**Tiempo Estimado:** 2 días

---

#### Feature 7: Word Cloud Interactivo
**Descripción:** Nube de palabras más frecuentes

**Implementación:**
```html
<script src="https://cdn.jsdelivr.net/npm/wordcloud@1.2.2/src/wordcloud2.js"></script>

<script>
WordCloud(document.getElementById('wordcloud'), {
    list: [
        ['excelente', 45],
        ['calidad', 38],
        ['bueno', 32],
        // más palabras
    ],
    gridSize: 10,
    weightFactor: 2,
    color: function(word, weight) {
        return weight > 30 ? '#4CAF50' : '#999';
    }
});
</script>
```

**Tiempo Estimado:** 1 día

---

### 🟢 BAJA PRIORIDAD

#### Feature 8: Tema Oscuro (Dark Mode)
**Descripción:** Toggle para cambiar entre tema claro y oscuro

**Implementación:**
```javascript
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme',
        document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    );
}

// Cargar tema guardado
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}
```

**CSS:**
```css
.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --card-bg: #2d2d2d;
}
```

**Tiempo Estimado:** 1 día

---

#### Feature 9: Animaciones y Transiciones
**Descripción:** Mejorar UX con animaciones suaves

**Características:**
- Fade in de tarjetas
- Skeleton loaders durante carga
- Transiciones suaves en gráficos
- Animación de números (counter)

**Tiempo Estimado:** 1-2 días

---

#### Feature 10: Página de Configuración
**Descripción:** Panel para configurar notificaciones y alertas

**Componentes:**
- Configuración de email
- Webhooks
- Umbrales de alertas
- Preferencias de exportación

**Tiempo Estimado:** 2 días

---

## Priorización General

### Sprint 1 (5-7 días) - CRÍTICO PARA DEMO

**Backend:**
1. Sistema de Exportación Excel ⭐⭐⭐⭐⭐
2. Sistema de Alertas ⭐⭐⭐⭐
3. Métricas NPS/CSAT ⭐⭐⭐⭐

**Data Science:**
1. Análisis de Emociones ⭐⭐⭐⭐⭐
2. Detección de Sarcasmo ⭐⭐⭐⭐
3. Keywords Automáticas ⭐⭐⭐

**Frontend:**
1. Dashboard Avanzado ⭐⭐⭐⭐⭐
2. Página de Exportación ⭐⭐⭐⭐
3. Sistema de Alertas UI ⭐⭐⭐⭐

### Sprint 2 (3-5 días) - MEJORAS IMPORTANTES

**Backend:**
4. Sistema de Notificaciones ⭐⭐⭐
5. Sistema de Comparación ⭐⭐⭐

**Data Science:**
4. Clustering K-means ⭐⭐⭐
5. Detección de Anomalías ⭐⭐

**Frontend:**
4. Gráfico de Emociones ⭐⭐⭐
5. Página de Métricas ⭐⭐⭐

### Sprint 3 (2-3 días) - PULIDO FINAL

**Backend:**
6. Sistema de Caché ⭐⭐
7. Tareas Programadas ⭐

**Data Science:**
6. Análisis de Entidades ⭐⭐

**Frontend:**
6. Página de Comparación ⭐⭐
7. Word Cloud ⭐⭐

---

## Tabla Resumen por Complejidad

| Feature | Equipo | Prioridad | Complejidad | Tiempo | Impacto Demo |
|---------|--------|-----------|-------------|--------|--------------|
| Exportación Excel | Backend | Alta | Media | 2-3d | ⭐⭐⭐⭐⭐ |
| Sistema de Alertas | Backend | Alta | Media | 2d | ⭐⭐⭐⭐ |
| Métricas NPS/CSAT | Backend | Alta | Baja | 1-2d | ⭐⭐⭐⭐ |
| Análisis Emociones | Data Science | Alta | Media | 2d | ⭐⭐⭐⭐⭐ |
| Detección Sarcasmo | Data Science | Alta | Alta | 2d | ⭐⭐⭐⭐ |
| Keywords TF-IDF | Data Science | Alta | Baja | 1-2d | ⭐⭐⭐ |
| Dashboard Avanzado | Frontend | Alta | Alta | 3-4d | ⭐⭐⭐⭐⭐ |
| Página Exportación | Frontend | Alta | Media | 2d | ⭐⭐⭐⭐ |
| Alertas UI | Frontend | Alta | Media | 2d | ⭐⭐⭐⭐ |

---

## Recomendaciones de Implementación

### Para el Equipo Backend:
1. **Empezar con Exportación Excel** - Es lo más impactante visualmente
2. **Sistema de Alertas** - Complementa bien con las métricas
3. **NO sobre-ingeniería** - Implementar versión MVP primero

### Para el Equipo Data Science:
1. **Análisis de Emociones primero** - Es el diferenciador clave
2. **Keywords TF-IDF** - Rápido de implementar, alto impacto
3. **Sarcasmo al final** - Solo si hay tiempo

### Para el Equipo Frontend:
1. **Dashboard primero** - Es lo primero que ven los jueces
2. **Hacer mockups** - Validar diseño antes de codificar
3. **Mobile-first** - Asegurar que funcione en diferentes pantallas

---

## Coordinación Entre Equipos

### Backend ↔ Data Science
- **Contrato de API:** Definir formato de respuesta con emociones
- **Testing:** Backend debe tener mocks de las nuevas respuestas
- **Documentación:** Actualizar Swagger con nuevos campos

### Backend ↔ Frontend
- **Endpoints listos primero:** Backend expone endpoints de prueba
- **Formato JSON acordado:** Definir estructura de respuestas
- **CORS configurado:** No olvidar habilitar CORS

### Data Science ↔ Frontend
- **Visualización de emociones:** Acordar formato de gráfico radar
- **Tooltips explicativos:** Frontend debe explicar qué significa cada emoción

---

## Checklist Final para Demo

### Backend ✅
- [ ] Excel con 3+ hojas descargable
- [ ] Alertas configurables y funcionando
- [ ] NPS y CSAT calculándose correctamente
- [ ] Swagger actualizado con todas las rutas

### Data Science ✅
- [ ] 6 emociones detectándose
- [ ] Sarcasmo con 3+ patrones funcionando
- [ ] Keywords top 10 extrayéndose
- [ ] Todos los modelos respondiendo en <2 segundos

### Frontend ✅
- [ ] Dashboard con 5+ gráficos funcionando
- [ ] Exportación descargando archivos
- [ ] Alertas visibles en navbar
- [ ] Responsive en mobile y desktop
- [ ] Sin errores en consola

---

**Última Actualización:** 2026-01-12
**Documento Creado Por:** Análisis de Analitic 3.5
