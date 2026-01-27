from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict
import joblib
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sentiment Analysis ML Service",
    description="API de Machine Learning para análisis de sentimientos en Español e Inglés",
    version="2.0.0"
)

# Pipelines globales (se cargan al iniciar)
pipeline_es = None
pipeline_en = None

class SentimentRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=5000, description="Texto a analizar")
    language: str = Field(default="es", pattern="^(es|en)$", description="Idioma del texto: 'es' para español, 'en' para inglés")

    @validator('text')
    def validate_text(cls, v):
        v = v.strip()

        if len(v) < 5:
            raise ValueError('El texto debe tener al menos 5 caracteres')

        if not any(c.isalnum() for c in v):
            raise ValueError('El texto debe contener al menos una letra o número')

        return v

class SentimentResponse(BaseModel):
    prevision: str
    probabilidad: float
    probabilidades_detalle: Dict[str, float]
    idioma: str
    timestamp: str

@app.on_event("startup")
async def load_models():
    """Cargar pipelines de ML al iniciar la aplicación"""
    global pipeline_es, pipeline_en

    base_path = "../models"

    # Cargar pipeline español
    pipeline_es_path = os.path.join(base_path, "pipeline_sentimientos_español.pkl")
    if os.path.exists(pipeline_es_path):
        try:
            pipeline_es = joblib.load(pipeline_es_path)
            logger.info(f"Pipeline español cargado correctamente: {len(pipeline_es.classes_)} clases")
            logger.info(f"Clases disponibles: {pipeline_es.classes_}")
        except Exception as e:
            logger.error(f"Error al cargar pipeline español: {e}")
    else:
        logger.warning(f"Pipeline español no encontrado en {pipeline_es_path}")

    # Cargar pipeline inglés
    pipeline_en_path = os.path.join(base_path, "pipeline_sentimientos_ingles.pkl")
    if os.path.exists(pipeline_en_path):
        try:
            pipeline_en = joblib.load(pipeline_en_path)
            logger.info(f"Pipeline inglés cargado correctamente: {len(pipeline_en.classes_)} clases")
            logger.info(f"Clases disponibles: {pipeline_en.classes_}")
        except Exception as e:
            logger.error(f"Error al cargar pipeline inglés: {e}")
    else:
        logger.warning(f"Pipeline inglés no encontrado en {pipeline_en_path}")

@app.get("/")
async def root():
    """Endpoint raíz con información del servicio"""
    return {
        "service": "Sentiment Analysis ML Service",
        "version": "2.0.0",
        "status": "running",
        "models_available": {
            "spanish": pipeline_es is not None,
            "english": pipeline_en is not None
        },
        "supported_languages": ["es", "en"]
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    models_loaded = (pipeline_es is not None or pipeline_en is not None)

    return {
        "status": "healthy" if models_loaded else "degraded",
        "models": {
            "spanish": pipeline_es is not None,
            "english": pipeline_en is not None
        },
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict", response_model=SentimentResponse)
async def predict(request: SentimentRequest):
    """
    Predice el sentimiento de un texto

    Args:
        request: SentimentRequest con text y language

    Returns:
        SentimentResponse con la predicción y probabilidades
    """
    # Seleccionar pipeline según idioma
    if request.language == "es":
        pipeline = pipeline_es
        lang_name = "español"
    elif request.language == "en":
        pipeline = pipeline_en
        lang_name = "inglés"
    else:
        raise HTTPException(
            status_code=400,
            detail="Idioma no soportado. Use 'es' para español o 'en' para inglés"
        )

    # Verificar que el pipeline esté cargado
    if pipeline is None:
        raise HTTPException(
            status_code=503,
            detail=f"El modelo de {lang_name} no está disponible"
        )

    try:
        # Predecir usando el pipeline
        prediction = pipeline.predict([request.text])[0]
        probabilities = pipeline.predict_proba([request.text])[0]

        # Obtener probabilidad de la clase predicha
        class_idx = list(pipeline.classes_).index(prediction)
        probability = float(probabilities[class_idx])

        # Crear diccionario de probabilidades por clase
        prob_detail = {
            str(clase): round(float(prob), 4)
            for clase, prob in zip(pipeline.classes_, probabilities)
        }

        logger.info(f"Predicción exitosa - Idioma: {request.language}, Resultado: {prediction}, Confianza: {probability:.4f}")

        return SentimentResponse(
            prevision=str(prediction),
            probabilidad=round(probability, 4),
            probabilidades_detalle=prob_detail,
            idioma=request.language,
            timestamp=datetime.now().isoformat()
        )

    except Exception as e:
        logger.error(f"Error en predicción: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar la predicción: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
