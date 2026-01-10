#!/usr/bin/env python3
"""
Script para inspeccionar los modelos .pkl y verificar su estructura
"""
import joblib
import sys

def inspect_model(filename, name):
    """Inspecciona un archivo .pkl"""
    print(f"\n{'='*80}")
    print(f"📊 {name}")
    print(f"{'='*80}")
    print(f"Archivo: {filename}")

    try:
        obj = joblib.load(filename)
        print(f"✅ Cargado exitosamente")
        print(f"✅ Tipo: {type(obj).__name__}")

        # Si es un modelo con clases
        if hasattr(obj, 'classes_'):
            print(f"✅ Clases: {obj.classes_}")
            print(f"✅ Número de clases: {len(obj.classes_)}")
            print(f"✅ Tipo de clases: {type(obj.classes_[0])}")

        # Si es vectorizador
        if hasattr(obj, 'vocabulary_'):
            print(f"✅ Tamaño vocabulario: {len(obj.vocabulary_):,}")

        # Si es pipeline
        if hasattr(obj, 'steps'):
            print(f"✅ Steps del pipeline:")
            for step_name, step_obj in obj.steps:
                print(f"   - {step_name}: {type(step_obj).__name__}")

        return obj

    except Exception as e:
        print(f"❌ Error al cargar: {e}")
        return None

def test_prediction(model, vectorizer, text, lang):
    """Prueba una predicción"""
    print(f"\n{'='*80}")
    print(f"🧪 TEST DE PREDICCIÓN - {lang}")
    print(f"{'='*80}")
    print(f"Texto: '{text}'")

    try:
        # Vectorizar
        text_vec = vectorizer.transform([text])

        # Predecir
        prediction = model.predict(text_vec)[0]
        probabilities = model.predict_proba(text_vec)[0]

        print(f"✅ Predicción: {prediction}")
        print(f"✅ Tipo de predicción: {type(prediction)}")
        print(f"✅ Es string: {isinstance(prediction, str)}")
        print(f"✅ Probabilidades por clase:")

        for clase, prob in zip(model.classes_, probabilities):
            print(f"   - {clase}: {prob:.4f} ({prob*100:.2f}%)")

        return True

    except Exception as e:
        print(f"❌ Error en predicción: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_pipeline(pipeline, text, lang):
    """Prueba predicción con pipeline"""
    print(f"\n{'='*80}")
    print(f"🧪 TEST DE PIPELINE - {lang}")
    print(f"{'='*80}")
    print(f"Texto: '{text}'")

    try:
        # Predecir directamente
        prediction = pipeline.predict([text])[0]
        probabilities = pipeline.predict_proba([text])[0]

        print(f"✅ Predicción: {prediction}")
        print(f"✅ Tipo de predicción: {type(prediction)}")
        print(f"✅ Es string: {isinstance(prediction, str)}")
        print(f"✅ Probabilidades por clase:")

        for clase, prob in zip(pipeline.classes_, probabilities):
            print(f"   - {clase}: {prob:.4f} ({prob*100:.2f}%)")

        return True

    except Exception as e:
        print(f"❌ Error en predicción: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("""
    ╔════════════════════════════════════════════════════════════════════════════╗
    ║                   INSPECCIÓN DE MODELOS ML - HACKATHON                     ║
    ╚════════════════════════════════════════════════════════════════════════════╝
    """)

    # Inspeccionar archivos español
    print("\n" + "🇪🇸 MODELOS EN ESPAÑOL ".center(80, "="))
    modelo_es = inspect_model('modelo_sentimientos_español.pkl', 'MODELO ESPAÑOL')
    vec_es = inspect_model('tfidf_vectorizador_español.pkl', 'VECTORIZADOR ESPAÑOL')
    pipeline_es = inspect_model('pipeline_sentimientos_español.pkl', 'PIPELINE ESPAÑOL')

    # Inspeccionar archivos inglés
    print("\n\n" + "🇬🇧 MODELOS EN INGLÉS ".center(80, "="))
    modelo_en = inspect_model('modelo_sentimientos_ingles.pkl', 'MODELO INGLÉS')
    vec_en = inspect_model('tfidf_vectorizador_ingles.pkl', 'VECTORIZADOR INGLÉS')
    pipeline_en = inspect_model('pipeline_sentimientos_ingles.pkl', 'PIPELINE INGLÉS')

    # Pruebas de predicción
    print("\n\n" + " PRUEBAS DE PREDICCIÓN ".center(80, "="))

    if modelo_es and vec_es:
        test_prediction(
            modelo_es,
            vec_es,
            "Este producto es excelente, me encantó mucho",
            "ESPAÑOL (modelo + vectorizador)"
        )

    if pipeline_es:
        test_pipeline(
            pipeline_es,
            "Este servicio es terrible, no lo recomiendo",
            "ESPAÑOL (pipeline)"
        )

    if modelo_en and vec_en:
        test_prediction(
            modelo_en,
            vec_en,
            "This product is amazing, I love it",
            "INGLÉS (modelo + vectorizador)"
        )

    if pipeline_en:
        test_pipeline(
            pipeline_en,
            "This service is terrible, I don't recommend it",
            "INGLÉS (pipeline)"
        )

    # Resumen final
    print(f"\n\n{'='*80}")
    print("📋 RESUMEN DE VERIFICACIÓN")
    print(f"{'='*80}")
    print(f"✅ Modelos cargados correctamente")
    print(f"✅ Español: {len(modelo_es.classes_)} clases - {modelo_es.classes_}")
    print(f"✅ Inglés: {len(modelo_en.classes_)} clases - {modelo_en.classes_}")
    print(f"\n💡 RECOMENDACIÓN:")
    print(f"   → Usar PIPELINE para simplificar la API")
    print(f"   → El pipeline incluye preprocesamiento + vectorización + predicción")
    print(f"   → Solo se necesita llamar pipeline.predict([text])")
    print(f"{'='*80}\n")
