from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
from pathlib import Path
from datetime import datetime

app = FastAPI(
    title="Sentiment Analysis ML Service",
    version="1.0.0"
)

# =========================
# RUTAS
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

PIPELINE_ES = MODELS_DIR / "pipeline_sentimientos_español.pkl"
PIPELINE_EN = MODELS_DIR / "pipeline_sentimientos_ingles.pkl"

pipeline_es = None
pipeline_en = None

# =========================
# SCHEMAS
# =========================
class SentimentRequest(BaseModel):
    text: str
    lang: str = "es"  # es | en

class SentimentResponse(BaseModel):
    prediction: str
    probability: float
    timestamp: str

# =========================
# STARTUP
# =========================
@app.on_event("startup")
def load_models():
    global pipeline_es, pipeline_en
    try:
        if PIPELINE_ES.exists():
            pipeline_es = joblib.load(PIPELINE_ES)
            print("Modelo español cargado")

        if PIPELINE_EN.exists():
            pipeline_en = joblib.load(PIPELINE_EN)
            print("Modelo inglés cargado")
    except Exception as e:
        print("Error cargando modelos:", e)

# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health():
    return {
        "status": "ok",
        "models_loaded": {
            "es": pipeline_es is not None,
            "en": pipeline_en is not None
        }
    }

# =========================
# PREDICT
# =========================
@app.post("/predict", response_model=SentimentResponse)
def predict(request: SentimentRequest):

    pipeline = pipeline_es if request.lang == "es" else pipeline_en

    if pipeline is None:
        raise HTTPException(status_code=503, detail="Modelo no disponible")

    prediction_raw = pipeline.predict([request.text])[0]
    probability = max(pipeline.predict_proba([request.text])[0])

    # Normalización segura
    if isinstance(prediction_raw, (int, float)):
        sentiment = "Positivo" if prediction_raw == 1 else "Negativo"
    else:
        sentiment = str(prediction_raw).capitalize()

    return SentimentResponse(
        prediction=sentiment,
        probability=round(float(probability), 4),
        timestamp=datetime.now().isoformat()
    )
