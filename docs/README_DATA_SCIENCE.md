## ANÁLISIS DE SENTIMEINTO

📊 Análisis de Sentimientos en Opiniones de Clientes Proyecto de Ciencia de Datos / PNL 📌 Descripción del proyecto

Este proyecto implementa un modelo de clasificación supervisada para realizar análisis de sentimientos sobre opiniones de clientes (reseñas, comentarios y encuestas de satisfacción).

El objetivo es ayudar a áreas como Atención al Cliente, Marketing y Operaciones a entender rápidamente la percepción del cliente, clasificando los textos en tres categorías:

✅ Positivo
➖ Neutro
❌ Negativo
🎯 Objetivo



Desarrollar un pipeline de Procesamiento de Lenguaje Natural (NLP) que permita:

Limpiar y preprocesar texto en español

Transformar texto en variables numéricas mediante TF-IDF

Entrenar un modelo supervisado de clasificación

Evaluar el desempeño con métricas estándar

Serializar el modelo para su reutilización

🧠 Tipo de problema

Aprendizaje supervisado

Clasificación multiclase

Procesamiento de lenguaje natural (PNL)

📁 Estructura del proyecto
├── dataset_sentimientos_robusto.csv 
├── modelo_sentimientos.pkl 
├── tfidf_vectorizador.pkl 
├── pipeline_sentimientos.pkl 
├── notebook.ipynb 
  └── README_DATA_SCIENCE.md

## CONJUNTO DE DATOS

🗃️ El conjunto de datos contiene opiniones de clientes junto con información adicional del proceso de atención.

#Columnas relevantes:

texto: comentario u opinión del cliente (variable independiente)

sentimiento: etiqueta de sentimiento (variable objetivo)

Positivo

Neutro

Negativo

Otras columnas:

tiempo_respuesta_horas

resolución

canal

categorías

📌 Para este proyecto, solo se utiliza la columna texto como entrada del modelo, y sentimiento como objetivo variable.


 ## 🔍 EXPLORACIÓN Y LIMPIEZA DE DATOS (EDA)


Durante el análisis exploratorio se realizó:

Revisión de tipos de datos

Detección de valores faltantes (NaN)

Análisis de la distribución de la variable objetivo.

Identificación de variables categóricas y numéricas

Tratamiento de valores faltantes:

Variables numéricas: imputación mediante mediana

Variables categóricas: imputación con categoría "Desconocido"


## 🧹PREPROCESAMIENTO DE TEXTO


Se aplicarán las siguientes técnicas de limpieza:

Conversión a minúsculas

Eliminación de signos de puntuación

Normalización de números usando el token NUM

Eliminación de palabras vacías en español.

limpia conservación de palabras de negación (no, nunca, jamás, pecado)

Este preprocesamiento permite reducir el ruido sin perder información semántica relevante para el análisis de sentimiento.


## 🔢 VECTORIZACIÓN DE TEXTO (TF-IDF)


El texto limpio se transformó en variables numéricas mediante TF-IDF (Term Frequency – Inverse Document Frequency), utilizando:

Unigramas y bigramas

Límite máximo de características para controlar la dimensionalidad

🤖 Modelos utilizados

Se entrenó un modelo de:

Regresión Logística (modelo principal)

Este modelo fue elegido por:

Buen desempeño en problemas de PNL

Interpretabilidad

Eficiencia computacional


## 📈 EVALUACIÓN DEL MODELO


El modelo fue evaluado usando las siguientes métricas:

Exactitud (Accuracy)

Precisión (Precision)

Recuperación

Puntuación F1

Además, se utilizó un informe de clasificación para analizar el desempeño por clase.


## 💾 SERIALIZACIÓN DEL MODELO


Para permitir su reutilización en producción, se serializaron:

El modelo entrenado

El vectorizador TF-IDF

Un pipeline completo (TF-IDF + modelo)

Se utilizó la librería joblib.


## ⚙️ TECNOLOGIAS Y LIBRERIAS UTILIZADAS

-Python 3
-pandas
-Numpy
-nltk
-scikit-learn
-matplotlib / nacido en el mar
-biblioteca de trabajos
