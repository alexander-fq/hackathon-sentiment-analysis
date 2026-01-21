# %% [markdown]
# # 🎯 Análisis de Sentimientos - Dataset Robusto
# ## Hackathon - Entrenamiento del Modelo
# 
# Este notebook demuestra cómo entrenar un modelo de análisis de sentimientos
# usando el dataset robusto de 15,000 registros.

# %% [markdown]
# ## 1. Importar Librerías

# %%
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.metrics import precision_recall_fscore_support
import joblib
import warnings
warnings.filterwarnings('ignore')

# Configuración de visualización
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

# %% [markdown]
# ## 2. Cargar y Explorar el Dataset

# %%
# Cargar el dataset
df = pd.read_csv('dataset_sentimientos_robusto.csv')

print("="*60)
print("INFORMACIÓN DEL DATASET")
print("="*60)
print(f"\nShape: {df.shape}")
print(f"Columnas: {df.columns.tolist()}")
print(f"\nPrimeras filas:")
print(df.head())

# %%
# Información general
print("\n" + "="*60)
print("ESTADÍSTICAS GENERALES")
print("="*60)
print(df.info())

# %%
# Distribución de sentimientos
print("\n" + "="*60)
print("DISTRIBUCIÓN DE SENTIMIENTOS")
print("="*60)
print(df['sentimiento'].value_counts())
print("\nPorcentajes:")
print(df['sentimiento'].value_counts(normalize=True) * 100)

# %%
# Visualizar distribución de sentimientos
plt.figure(figsize=(10, 6))
df['sentimiento'].value_counts().plot(kind='bar', color=['green', 'red', 'gray'])
plt.title('Distribución de Sentimientos', fontsize=16, fontweight='bold')
plt.xlabel('Sentimiento')
plt.ylabel('Cantidad')
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig('distribucion_sentimientos.png', dpi=300)
plt.show()

# %% [markdown]
# ## 3. Análisis Exploratorio de Datos (EDA)

# %%
# Distribución por categoría
print("\n" + "="*60)
print("DISTRIBUCIÓN POR CATEGORÍA")
print("="*60)
print(df['categoria'].value_counts())

plt.figure(figsize=(12, 6))
df['categoria'].value_counts().plot(kind='barh')
plt.title('Distribución por Categoría de Negocio', fontsize=14, fontweight='bold')
plt.xlabel('Cantidad')
plt.tight_layout()
plt.savefig('distribucion_categoria.png', dpi=300)
plt.show()

# %%
# Análisis de calificaciones por sentimiento
print("\n" + "="*60)
print("CALIFICACIONES POR SENTIMIENTO")
print("="*60)
calif_sentimiento = pd.crosstab(df['sentimiento'], df['calificacion'])
print(calif_sentimiento)

plt.figure(figsize=(10, 6))
calif_sentimiento.T.plot(kind='bar', stacked=False)
plt.title('Calificaciones por Sentimiento', fontsize=14, fontweight='bold')
plt.xlabel('Calificación')
plt.ylabel('Cantidad')
plt.legend(title='Sentimiento')
plt.tight_layout()
plt.savefig('calificaciones_sentimiento.png', dpi=300)
plt.show()

# %%
# Análisis de prioridades
print("\n" + "="*60)
print("DISTRIBUCIÓN DE PRIORIDADES")
print("="*60)
print(df['prioridad'].value_counts())

prioridad_sentimiento = pd.crosstab(df['prioridad'], df['sentimiento'])
print("\nPrioridad por Sentimiento:")
print(prioridad_sentimiento)

# %%
# Análisis de temas
print("\n" + "="*60)
print("TEMAS PRINCIPALES POR SENTIMIENTO")
print("="*60)
tema_sentimiento = pd.crosstab(df['tema_principal'], df['sentimiento'])
print(tema_sentimiento)

plt.figure(figsize=(12, 6))
tema_sentimiento.plot(kind='bar', stacked=False)
plt.title('Distribución de Temas por Sentimiento', fontsize=14, fontweight='bold')
plt.xlabel('Tema Principal')
plt.ylabel('Cantidad')
plt.legend(title='Sentimiento')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.savefig('temas_sentimiento.png', dpi=300)
plt.show()

# %%
# Análisis de texto
print("\n" + "="*60)
print("ANÁLISIS DE CARACTERÍSTICAS DEL TEXTO")
print("="*60)
print(f"Promedio de caracteres: {df['longitud_caracteres'].mean():.2f}")
print(f"Promedio de palabras: {df['num_palabras'].mean():.2f}")
print(f"Comentarios con mayúsculas excesivas: {df['tiene_mayusculas_excesivas'].sum()}")
print(f"Promedio de exclamaciones: {df['num_signos_exclamacion'].mean():.2f}")

# %%
# Análisis de canales
print("\n" + "="*60)
print("SENTIMIENTOS POR CANAL")
print("="*60)
canal_sentimiento = pd.crosstab(df['canal'], df['sentimiento'], normalize='index') * 100
print(canal_sentimiento.round(2))

plt.figure(figsize=(12, 6))
canal_sentimiento.plot(kind='bar', stacked=True)
plt.title('Distribución de Sentimientos por Canal (%)', fontsize=14, fontweight='bold')
plt.xlabel('Canal')
plt.ylabel('Porcentaje')
plt.legend(title='Sentimiento')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.savefig('sentimientos_canal.png', dpi=300)
plt.show()

# %% [markdown]
# ## 4. Preparación de Datos para el Modelo

# %%
# Preparar datos
X = df['texto']
y = df['sentimiento']

print("="*60)
print("PREPARACIÓN DE DATOS")
print("="*60)
print(f"Total de muestras: {len(X)}")
print(f"Distribución de clases:")
print(y.value_counts())

# %%
# División train/test (80/20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2, 
    random_state=42,
    stratify=y  # Mantiene las proporciones
)

print(f"\nConjunto de entrenamiento: {len(X_train)} muestras")
print(f"Conjunto de prueba: {len(X_test)} muestras")

print(f"\nDistribución en entrenamiento:")
print(y_train.value_counts())
print(f"\nDistribución en prueba:")
print(y_test.value_counts())

# %% [markdown]
# ## 5. Vectorización con TF-IDF

# %%
# Crear vectorizador TF-IDF
print("\n" + "="*60)
print("VECTORIZACIÓN TF-IDF")
print("="*60)

vectorizer = TfidfVectorizer(
    max_features=5000,      # Top 5000 palabras más importantes
    ngram_range=(1, 2),     # Unigramas y bigramas
    min_df=2,               # Ignorar palabras que aparecen en menos de 2 documentos
    max_df=0.95,            # Ignorar palabras que aparecen en más del 95% de documentos
)

# Ajustar y transformar datos de entrenamiento
X_train_tfidf = vectorizer.fit_transform(X_train)
print(f"Shape de matriz TF-IDF (train): {X_train_tfidf.shape}")

# Transformar datos de prueba
X_test_tfidf = vectorizer.transform(X_test)
print(f"Shape de matriz TF-IDF (test): {X_test_tfidf.shape}")

print(f"\nVocabulario creado: {len(vectorizer.vocabulary_)} palabras")

# %%
# Palabras más importantes
feature_names = vectorizer.get_feature_names_out()
print(f"\nPrimeras 20 features:")
print(feature_names[:20])

# %% [markdown]
# ## 6. Entrenamiento del Modelo

# %%
# Modelo 1: Logistic Regression
print("\n" + "="*60)
print("ENTRENANDO MODELO: LOGISTIC REGRESSION")
print("="*60)

modelo_lr = LogisticRegression(
    max_iter=1000,
    random_state=42,
    class_weight='balanced'  # Para manejar desbalance de clases
)

modelo_lr.fit(X_train_tfidf, y_train)
print("✅ Modelo Logistic Regression entrenado!")

# %%
# Predicciones
y_pred_lr = modelo_lr.predict(X_test_tfidf)
y_pred_proba_lr = modelo_lr.predict_proba(X_test_tfidf)

# Evaluar
accuracy_lr = accuracy_score(y_test, y_pred_lr)
print(f"\n📊 Accuracy: {accuracy_lr:.4f} ({accuracy_lr*100:.2f}%)")

# %%
# Reporte de clasificación detallado
print("\n" + "="*60)
print("REPORTE DE CLASIFICACIÓN - LOGISTIC REGRESSION")
print("="*60)
print(classification_report(y_test, y_pred_lr))

# %%
# Matriz de confusión
cm = confusion_matrix(y_test, y_pred_lr, labels=['Positivo', 'Neutro', 'Negativo'])
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['Positivo', 'Neutro', 'Negativo'],
            yticklabels=['Positivo', 'Neutro', 'Negativo'])
plt.title('Matriz de Confusión - Logistic Regression', fontsize=16, fontweight='bold')
plt.ylabel('Real')
plt.xlabel('Predicción')
plt.tight_layout()
plt.savefig('matriz_confusion.png', dpi=300)
plt.show()

# %% [markdown]
# ## 7. Modelo Alternativo: Naive Bayes

# %%
# Modelo 2: Multinomial Naive Bayes
print("\n" + "="*60)
print("ENTRENANDO MODELO: NAIVE BAYES")
print("="*60)

modelo_nb = MultinomialNB(alpha=1.0)
modelo_nb.fit(X_train_tfidf, y_train)
print("✅ Modelo Naive Bayes entrenado!")

# %%
# Predicciones
y_pred_nb = modelo_nb.predict(X_test_tfidf)
accuracy_nb = accuracy_score(y_test, y_pred_nb)
print(f"\n📊 Accuracy: {accuracy_nb:.4f} ({accuracy_nb*100:.2f}%)")

print("\n" + "="*60)
print("REPORTE DE CLASIFICACIÓN - NAIVE BAYES")
print("="*60)
print(classification_report(y_test, y_pred_nb))

# %% [markdown]
# ## 8. Comparación de Modelos

# %%
# Comparar modelos
print("\n" + "="*60)
print("COMPARACIÓN DE MODELOS")
print("="*60)

modelos_comparacion = {
    'Logistic Regression': accuracy_lr,
    'Naive Bayes': accuracy_nb
}

for nombre, acc in modelos_comparacion.items():
    print(f"{nombre:25s}: {acc:.4f} ({acc*100:.2f}%)")

# Elegir el mejor modelo
mejor_modelo = 'Logistic Regression' if accuracy_lr > accuracy_nb else 'Naive Bayes'
print(f"\n🏆 Mejor modelo: {mejor_modelo}")

# %% [markdown]
# ## 9. Análisis de Features Importantes

# %%
# Features más importantes para cada clase (Logistic Regression)
print("\n" + "="*60)
print("PALABRAS MÁS IMPORTANTES POR SENTIMIENTO")
print("="*60)

# Obtener coeficientes
feature_names = np.array(vectorizer.get_feature_names_out())
clases = modelo_lr.classes_

for i, clase in enumerate(clases):
    print(f"\n{'='*30}")
    print(f"SENTIMIENTO: {clase}")
    print(f"{'='*30}")
    
    # Top 15 palabras más importantes
    coefs = modelo_lr.coef_[i]
    top_indices = np.argsort(coefs)[-15:][::-1]
    top_features = feature_names[top_indices]
    top_coefs = coefs[top_indices]
    
    for feature, coef in zip(top_features, top_coefs):
        print(f"{feature:20s}: {coef:.4f}")

# %% [markdown]
# ## 10. Pruebas con Ejemplos Reales

# %%
# Función para predecir
def predecir_sentimiento(texto, modelo=modelo_lr, vectorizer=vectorizer):
    # Vectorizar
    texto_tfidf = vectorizer.transform([texto])
    
    # Predecir
    prediccion = modelo.predict(texto_tfidf)[0]
    probabilidades = modelo.predict_proba(texto_tfidf)[0]
    
    # Crear resultado
    resultado = {
        'texto': texto,
        'sentimiento': prediccion,
        'probabilidad': max(probabilidades),
        'probabilidades_detalle': dict(zip(modelo.classes_, probabilidades))
    }
    
    return resultado

# %%
# Ejemplos de prueba
print("\n" + "="*60)
print("PRUEBAS CON EJEMPLOS")
print("="*60)

ejemplos = [
    "Excelente servicio, muy recomendado!",
    "Pésima experiencia, no lo recomiendo para nada",
    "Es un producto normal, nada especial",
    "HORRIBLE!!! No funciona y nadie responde",
    "Me encantó, superó mis expectativas completamente",
    "Está bien para el precio que pagué"
]

for ejemplo in ejemplos:
    resultado = predecir_sentimiento(ejemplo)
    print(f"\nTexto: {resultado['texto']}")
    print(f"Predicción: {resultado['sentimiento']}")
    print(f"Confianza: {resultado['probabilidad']:.2%}")
    print(f"Probabilidades: {resultado['probabilidades_detalle']}")
    print("-" * 60)

# %% [markdown]
# ## 11. Guardar Modelo y Vectorizer

# %%
# Guardar modelo y vectorizer
print("\n" + "="*60)
print("GUARDANDO MODELO Y VECTORIZER")
print("="*60)

# Guardar el mejor modelo
modelo_final = modelo_lr if accuracy_lr > accuracy_nb else modelo_nb
nombre_modelo = 'logistic_regression' if accuracy_lr > accuracy_nb else 'naive_bayes'

joblib.dump(modelo_final, f'modelo_sentimientos_{nombre_modelo}.pkl')
joblib.dump(vectorizer, 'vectorizer_tfidf.pkl')

print(f"✅ Modelo guardado: modelo_sentimientos_{nombre_modelo}.pkl")
print(f"✅ Vectorizer guardado: vectorizer_tfidf.pkl")

# %%
# Información del modelo guardado
import os
tamanio_modelo = os.path.getsize(f'modelo_sentimientos_{nombre_modelo}.pkl') / 1024
tamanio_vectorizer = os.path.getsize('vectorizer_tfidf.pkl') / 1024

print(f"\nTamaño del modelo: {tamanio_modelo:.2f} KB")
print(f"Tamaño del vectorizer: {tamanio_vectorizer:.2f} KB")
print(f"Accuracy final: {max(accuracy_lr, accuracy_nb):.4f}")

# %% [markdown]
# ## 12. Métricas Finales y Conclusiones

# %%
# Resumen final
print("\n" + "="*60)
print("RESUMEN FINAL DEL ENTRENAMIENTO")
print("="*60)

print(f"\n📊 DATASET:")
print(f"   - Total registros: {len(df):,}")
print(f"   - Entrenamiento: {len(X_train):,}")
print(f"   - Prueba: {len(X_test):,}")

print(f"\n🤖 MODELO:")
print(f"   - Tipo: {nombre_modelo.replace('_', ' ').title()}")
print(f"   - Accuracy: {max(accuracy_lr, accuracy_nb):.4f} ({max(accuracy_lr, accuracy_nb)*100:.2f}%)")
print(f"   - Features: {X_train_tfidf.shape[1]:,}")

print(f"\n📁 ARCHIVOS GENERADOS:")
print(f"   - modelo_sentimientos_{nombre_modelo}.pkl")
print(f"   - vectorizer_tfidf.pkl")
print(f"   - distribucion_sentimientos.png")
print(f"   - matriz_confusion.png")
print(f"   - temas_sentimiento.png")
print(f"   - sentimientos_canal.png")

print("\n✅ ENTRENAMIENTO COMPLETADO!")
print("="*60)

# %% [markdown]
# ## 13. Exportar para uso en API

# %%
# Crear archivo de configuración
config = {
    'modelo': nombre_modelo,
    'accuracy': float(max(accuracy_lr, accuracy_nb)),
    'clases': modelo_final.classes_.tolist(),
    'n_features': X_train_tfidf.shape[1],
    'fecha_entrenamiento': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
}

import json
with open('config_modelo.json', 'w') as f:
    json.dump(config, f, indent=2)

print("✅ Configuración guardada: config_modelo.json")
print(json.dumps(config, indent=2))

# %%
print("\n🎉 ¡NOTEBOOK COMPLETADO!")
print("El modelo está listo para ser integrado en tu API REST.")
print("Archivos generados:")
print("  1. modelo_sentimientos_*.pkl")
print("  2. vectorizer_tfidf.pkl")
print("  3. config_modelo.json")
print("\nSiguiente paso: Integrar con Spring Boot API")
