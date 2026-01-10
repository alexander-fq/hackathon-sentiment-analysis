# Imagen base de Nginx con Alpine (ligera)
FROM nginx:alpine

# Copiar archivos estáticos al directorio de Nginx
COPY public/ /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/

# Crear configuración de Nginx para SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Habilitar CORS para desarrollo \
    location /api { \
        add_header Access-Control-Allow-Origin *; \
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS"; \
        add_header Access-Control-Allow-Headers "Content-Type"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Comando por defecto (nginx ya está configurado en la imagen base)
CMD ["nginx", "-g", "daemon off;"]
