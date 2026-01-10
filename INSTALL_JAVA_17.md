# Cómo Instalar Java 17

## Opción 1: Eclipse Adoptium (Recomendado)

### Pasos:

1. Descargar Java 17:
   - Ir a: https://adoptium.net/temurin/releases/?version=17
   - Seleccionar:
     - Version: 17
     - Operating System: Windows
     - Architecture: x64
     - Package Type: JDK
   - Click en Download .msi

2. Instalar:
   - Ejecutar el archivo .msi descargado
   - Seguir el asistente de instalación
   - IMPORTANTE: Marcar la opción "Set JAVA_HOME variable"
   - IMPORTANTE: Marcar la opción "Add to PATH"

3. Verificar instalación:
   - Abrir nueva terminal (PowerShell o CMD)
   - Ejecutar: `java -version`
   - Debe mostrar: `openjdk version "17.x.x"`

---

## Opción 2: Manual con Configuración de Variables

Si ya descargaste Java 17 pero Maven sigue usando Java 25:

### Paso 1: Verificar dónde está instalado Java 17
```powershell
dir "C:\Program Files\Eclipse Adoptium" /s /b | findstr jdk-17
```

### Paso 2: Configurar JAVA_HOME temporalmente para este proyecto

Crear archivo: `backend/sentiment-api/set-java17.bat`

```batch
@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
echo Java configurado a version 17
java -version
```

Luego ejecutar:
```bash
cd backend/sentiment-api
set-java17.bat
mvnw clean compile
```

---

## Opción 3: Configurar Maven para usar Java 17 específico

Editar archivo: `backend/sentiment-api/.mvn/jvm.config`

Crear el archivo si no existe y agregar:
```
-Djava.home=C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot
```

---

## Opción 4: Actualizar Lombok en pom.xml (Alternativa)

Si no puedes instalar Java 17, actualiza Lombok a una versión compatible con Java 25.

En `backend/sentiment-api/pom.xml`, buscar:
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

Y en el plugin de compilación, actualizar la versión:
```xml
<path>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.34</version>  <!-- Cambiar a última versión -->
</path>
```

---

## Verificar después de instalar

```bash
# Verificar versión de Java
java -version

# Verificar JAVA_HOME
echo %JAVA_HOME%

# Limpiar y compilar
cd backend/sentiment-api
mvnw clean compile
```

---

## Troubleshooting

### Problema: Maven sigue usando Java 25
**Solución:** Cerrar todas las terminales y abrir una nueva

### Problema: JAVA_HOME apunta a Java 25
**Solución:**
```powershell
# En PowerShell como Administrador
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot", "Machine")
```

### Problema: No puedo cambiar JAVA_HOME globalmente
**Solución:** Usar la Opción 2 (archivo bat) o Opción 3 (jvm.config)
