@echo off
echo Configurando Java 17 para este proyecto...
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
echo.
echo JAVA_HOME configurado a: %JAVA_HOME%
echo.
echo Verificando version de Java:
java -version
echo.
echo Ahora puedes compilar con: mvnw clean compile
cmd /k
