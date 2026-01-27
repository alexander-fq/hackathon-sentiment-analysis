# Frontend React - Análisis de Sentimientos v2.0

Frontend React del sistema de análisis de sentimientos con integración completa al backend Spring Boot.

## Características Implementadas

### Funcionalidades Principales
- Análisis de sentimientos en tiempo real
- Selector de idioma funcional (Español/Inglés)
- Visualización de resultados con emojis
- Probabilidades detalladas de las 3 clases
- Información de idioma y timestamp
- Historial de análisis con filtros
- Dashboard de estadísticas con gráficos
- Sistema de autenticación (Login/Registro)
- Validaciones completas en formularios
- Manejo de errores robusto
- Diseño responsive con Tailwind CSS

### Componentes Creados

```
src/
├── components/
│   ├── Auth/                    (Componentes de autenticación)
│   ├── Dashboard/
│   │   ├── Header.jsx          ✅ Navegación con logout
│   │   ├── Hero.jsx            ✅ Sección hero
│   │   ├── LanguageSelector.jsx ✅ Selector ES/EN funcional
│   │   ├── AnalysisCard.jsx    ✅ Análisis con backend conectado
│   │   ├── ResultsCard.jsx     ✅ Resultados dinámicos
│   │   └── Footer.jsx          ✅ Footer completo
│   ├── History/
│   │   └── HistorySection.jsx  ✅ Historial con filtros
│   └── Statistics/
│       └── StatisticsSection.jsx ✅ Estadísticas con gráficos
├── pages/
│   ├── Login.jsx               ✅ Login funcional
│   ├── Register.jsx            ✅ Registro con validaciones
│   └── Dashboard.jsx           ✅ Dashboard principal
├── services/
│   ├── api.js                  ✅ Configuración Axios
│   ├── authService.js          ✅ Servicios de auth
│   └── sentimentService.js     ✅ Servicios de análisis
├── context/
│   └── AuthContext.jsx         ✅ Contexto de autenticación
└── utils/                      (Utilidades)
```

## Instalación

### Prerequisitos
- Node.js 18+ 
- npm o yarn
- Backend corriendo en http://localhost:8080
- FastAPI corriendo en http://localhost:8000

### Pasos

1. **Navegar al directorio del frontend React:**
```bash
cd frontend-react
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

4. **Abrir en el navegador:**
```
http://localhost:3000
```

## Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Vista previa de la build
```

## Configuración

### Variables de Entorno (Opcional)

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080
```

### Proxy API

El proxy está configurado en `vite.config.js` para redirigir las peticiones a `/api` al backend:

```javascript
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

## Uso

### 1. Análisis de Sentimientos

1. Ingresa texto en el campo de análisis
2. Selecciona el idioma (Español o Inglés)
3. Click en "Analizar Sentimiento"
4. Visualiza los resultados:
   - Sentimiento detectado con emoji
   - Nivel de confianza
   - Probabilidades de las 3 clases
   - Idioma y fecha del análisis

### 2. Historial

1. Scroll hasta la sección "Historial"
2. Filtra por tipo de sentimiento (Todos/Positivo/Neutro/Negativo)
3. Click en "Actualizar" para refrescar

### 3. Estadísticas

1. Visualiza las cards de resumen
2. Analiza los gráficos de barras y pastel
3. Click en "Actualizar" para refrescar datos

### 4. Autenticación

#### Registro:
1. Click en "Registrarse" en el header
2. Completa el formulario
3. La contraseña muestra indicador de seguridad
4. Verifica que las contraseñas coincidan
5. Click en "CREAR CUENTA"

#### Login:
1. Click en "Iniciar Sesión"
2. Ingresa usuario y contraseña
3. Click en "Acceder"
4. Serás redirigido al dashboard

## Validaciones Implementadas

### Análisis de Sentimientos
- Texto mínimo: 5 caracteres
- Texto máximo: 5000 caracteres
- Contador de caracteres en tiempo real
- Deshabilitar botón si no cumple requisitos

### Registro
- Username: mínimo 3 caracteres
- Email: formato válido
- Password: mínimo 6 caracteres
- Indicador de seguridad de contraseña
- Confirmación de contraseña

### Login
- Campos requeridos
- Mensajes de error específicos

## Endpoints Utilizados

### Autenticación
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/health
```

### Análisis de Sentimientos
```
POST /api/sentiment
GET  /api/sentiment/history
GET  /api/sentiment/history/{prediction}
GET  /api/sentiment/statistics
```

## Estructura de Datos

### Request de Análisis
```json
{
  "text": "Este producto es excelente",
  "language": "es"
}
```

### Response de Análisis
```json
{
  "prediction": "Positivo",
  "probability": 0.9952,
  "probabilitiesDetail": {
    "Positivo": 0.9952,
    "Neutro": 0.0047,
    "Negativo": 0.0002
  },
  "language": "es",
  "timestamp": "2026-01-26T14:15:00.760111"
}
```

## Características Técnicas

### Stack Tecnológico
- **React 18.2** - Librería UI
- **React Router 6** - Enrutamiento
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos
- **Tailwind CSS** - Estilos
- **Vite** - Build tool
- **Material Symbols** - Iconos

### Arquitectura
- Context API para gestión de estado global
- Custom hooks para lógica reutilizable
- Componentes funcionales con hooks
- Servicios separados para APIs
- Interceptores de Axios para tokens
- Rutas protegidas

### Optimizaciones
- Lazy loading de componentes (posible mejora futura)
- Code splitting automático con Vite
- Compilación optimizada para producción
- CSS purge con Tailwind

## Manejo de Errores

### Tipos de Errores Manejados
- **400 Bad Request**: Request inválido
- **401 Unauthorized**: No autenticado
- **422 Unprocessable Entity**: Validación fallida
- **503 Service Unavailable**: Servicio ML no disponible

### Mensajes de Error
- Mensajes claros y específicos por tipo de error
- Feedback visual con colores y alertas
- Logs en consola para debugging

## Testing

### Testing Manual
1. Verificar que el backend esté corriendo
2. Verificar que FastAPI esté corriendo
3. Probar análisis en español e inglés
4. Probar filtros en historial
5. Probar registro y login
6. Verificar responsive en móvil

### Checklist de Funcionalidades
- [ ] Análisis de sentimientos funciona
- [ ] Selector de idioma cambia el idioma
- [ ] Resultados se actualizan con datos reales
- [ ] Emojis cambian según el sentimiento
- [ ] Probabilidades muestran barras correctas
- [ ] Idioma y timestamp se muestran
- [ ] Historial carga datos
- [ ] Filtros de historial funcionan
- [ ] Estadísticas cargan datos
- [ ] Gráficos se renderizan correctamente
- [ ] Registro crea usuarios
- [ ] Login autentica usuarios
- [ ] Logout funciona
- [ ] Validaciones muestran errores

## Troubleshooting

### El análisis no funciona
- Verifica que el backend esté en http://localhost:8080
- Verifica que FastAPI esté en http://localhost:8000
- Revisa la consola del navegador para errores
- Verifica CORS en el backend

### Los gráficos no se muestran
- Verifica que haya datos en estadísticas
- Revisa si Recharts está instalado: `npm list recharts`

### Error de CORS
- Asegúrate de que el backend tenga CORS configurado
- Verifica la configuración en SecurityConfig.java

### Build falla
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Deployment

### Compilar para Producción
```bash
npm run build
```

Esto genera la carpeta `dist/` con los archivos optimizados.

### Servir Build
```bash
npm run preview
```

### Desplegar
Los archivos en `dist/` pueden ser desplegados en:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Nginx
- Apache

Configurar proxy reverso en producción para evitar CORS.

## Próximas Mejoras (Opcional)

- [ ] Tests unitarios con Jest
- [ ] Tests de integración con React Testing Library
- [ ] Internacionalización (i18n) completa
- [ ] Dark/Light mode toggle
- [ ] Exportar resultados a PDF
- [ ] Compartir análisis
- [ ] Guardar favoritos
- [ ] PWA (Progressive Web App)
- [ ] WebSockets para análisis en tiempo real
- [ ] Modo offline con Service Workers

## Notas Importantes

### Emojis
Los emojis en los resultados (😊 😐 😔) deben mantenerse ya que son parte de la interfaz visual de la aplicación.

### Puerto del Backend
El puerto configurado es 8080. Si tu backend usa otro puerto, modifica:
- `src/services/api.js` - línea del baseURL
- `vite.config.js` - configuración del proxy

### Autenticación Opcional
Para el hackathon, el dashboard es accesible sin autenticación. El sistema de login/registro está implementado pero no es obligatorio usarlo.

## Estructura Final del Proyecto

```
frontend-react/
├── public/
│   └── images/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── History/
│   │   └── Statistics/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── sentimentService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Soporte

Para problemas o preguntas:
1. Revisa la documentación del backend: `docs/`
2. Verifica los logs del navegador (F12)
3. Verifica los logs del backend
4. Consulta la documentación de la API: http://localhost:8000/docs

## Licencia

Proyecto del Hackathon 2026 - Análisis de Sentimientos v2.0

---

**Última actualización:** 26 de enero de 2026  
**Versión:** 2.0.0  
**Estado:** Completo y funcional
