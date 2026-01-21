"""
Script de prueba para la API de análisis de sentimientos
Ejecutar después de levantar la API con: uvicorn main:app --reload
"""
import requests
import json

API_URL = "http://localhost:8000"

def test_root():
    """Test endpoint raíz"""
    print("\n" + "="*80)
    print("TEST: GET /")
    print("="*80)

    try:
        response = requests.get(f"{API_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_health():
    """Test health check"""
    print("\n" + "="*80)
    print("TEST: GET /health")
    print("="*80)

    try:
        response = requests.get(f"{API_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_predict_spanish_positive():
    """Test predicción en español - sentimiento positivo"""
    print("\n" + "="*80)
    print("TEST: POST /predict - Español Positivo")
    print("="*80)

    payload = {
        "text": "Este producto es excelente, me encantó mucho. Muy recomendado",
        "language": "es"
    }

    try:
        response = requests.post(f"{API_URL}/predict", json=payload)
        print(f"Request:\n{json.dumps(payload, indent=2)}")
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_predict_spanish_negative():
    """Test predicción en español - sentimiento negativo"""
    print("\n" + "="*80)
    print("TEST: POST /predict - Español Negativo")
    print("="*80)

    payload = {
        "text": "Terrible servicio, no lo recomiendo para nada. Muy mala experiencia",
        "language": "es"
    }

    try:
        response = requests.post(f"{API_URL}/predict", json=payload)
        print(f"Request:\n{json.dumps(payload, indent=2)}")
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_predict_spanish_neutral():
    """Test predicción en español - sentimiento neutro"""
    print("\n" + "="*80)
    print("TEST: POST /predict - Español Neutro")
    print("="*80)

    payload = {
        "text": "El producto es normal, nada especial pero cumple su función",
        "language": "es"
    }

    try:
        response = requests.post(f"{API_URL}/predict", json=payload)
        print(f"Request:\n{json.dumps(payload, indent=2)}")
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_predict_english_positive():
    """Test predicción en inglés - sentimiento positivo"""
    print("\n" + "="*80)
    print("TEST: POST /predict - English Positive")
    print("="*80)

    payload = {
        "text": "This product is amazing, I absolutely love it. Highly recommended",
        "language": "en"
    }

    try:
        response = requests.post(f"{API_URL}/predict", json=payload)
        print(f"Request:\n{json.dumps(payload, indent=2)}")
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_predict_english_negative():
    """Test predicción en inglés - sentimiento negativo"""
    print("\n" + "="*80)
    print("TEST: POST /predict - English Negative")
    print("="*80)

    payload = {
        "text": "Terrible service, I don't recommend it at all. Very bad experience",
        "language": "en"
    }

    try:
        response = requests.post(f"{API_URL}/predict", json=payload)
        print(f"Request:\n{json.dumps(payload, indent=2)}")
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_validation_text_too_short():
    """Test validación - texto muy corto"""
    print("\n" + "="*80)
    print("TEST: Validación - Texto muy corto")
    print("="*80)

    payload = {
        "text": "Ok",
        "language": "es"
    }

    try:
        response = requests.post(f"{API_URL}/predict", json=payload)
        print(f"Request:\n{json.dumps(payload, indent=2)}")
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        return response.status_code == 422  # Validation error
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_validation_invalid_language():
    """Test validación - idioma inválido"""
    print("\n" + "="*80)
    print("TEST: Validación - Idioma inválido")
    print("="*80)

    payload = {
        "text": "Este es un texto de prueba",
        "language": "fr"  # Francés no soportado
    }

    try:
        response = requests.post(f"{API_URL}/predict", json=payload)
        print(f"Request:\n{json.dumps(payload, indent=2)}")
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        return response.status_code == 422  # Validation error
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_validation_only_special_chars():
    """Test validación - solo caracteres especiales"""
    print("\n" + "="*80)
    print("TEST: Validación - Solo caracteres especiales")
    print("="*80)

    payload = {
        "text": "!@#$%^&*()",
        "language": "es"
    }

    try:
        response = requests.post(f"{API_URL}/predict", json=payload)
        print(f"Request:\n{json.dumps(payload, indent=2)}")
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
        return response.status_code == 422  # Validation error
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def run_all_tests():
    """Ejecutar todos los tests"""
    print("\n")
    print("╔" + "="*78 + "╗")
    print("║" + " "*20 + "TESTING SENTIMENT ANALYSIS API" + " "*28 + "║")
    print("╚" + "="*78 + "╝")

    tests = [
        ("Root Endpoint", test_root),
        ("Health Check", test_health),
        ("Predict Spanish Positive", test_predict_spanish_positive),
        ("Predict Spanish Negative", test_predict_spanish_negative),
        ("Predict Spanish Neutral", test_predict_spanish_neutral),
        ("Predict English Positive", test_predict_english_positive),
        ("Predict English Negative", test_predict_english_negative),
        ("Validation - Text Too Short", test_validation_text_too_short),
        ("Validation - Invalid Language", test_validation_invalid_language),
        ("Validation - Only Special Chars", test_validation_only_special_chars),
    ]

    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\nERROR en {test_name}: {e}")
            results.append((test_name, False))

    # Resumen
    print("\n" + "="*80)
    print("RESUMEN DE TESTS")
    print("="*80)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        symbol = "✓" if result else "✗"
        print(f"{symbol} {test_name:<50} [{status}]")

    print("\n" + "="*80)
    print(f"Total: {passed}/{total} tests pasados ({passed/total*100:.1f}%)")
    print("="*80 + "\n")

if __name__ == "__main__":
    print("\nAsegúrate de que la API esté corriendo en http://localhost:8000")
    print("Para iniciar la API: cd data-science/api && uvicorn main:app --reload\n")

    input("Presiona Enter para iniciar los tests...")

    run_all_tests()
