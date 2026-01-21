const API_URL = "http://localhost:8081/api/sentiment";

const textInput = document.getElementById("textInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const predictionEl = document.getElementById("prediction");
const probabilityEl = document.getElementById("probability");
const probabilityBar = document.getElementById("probabilityBar");

analyzeBtn.addEventListener("click", analyzeSentiment);

async function analyzeSentiment() {
  const text = textInput.value;

  // Validación frontend
  if (!text.trim()) {
    alert("Por favor ingresa un texto para analizar");
    return;
  }

  loader.style.display = "block";
  result.style.display = "none";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error("Error en la API");
    }

    const data = await response.json();

    showResult(data);
  } catch (error) {
    showError();
  } finally {
    loader.style.display = "none";
  }
}

function showResult(data) {
  const { prediction, probability } = data;

  predictionEl.textContent = prediction;
  probabilityEl.textContent = (probability * 100).toFixed(2);

  applySentimentStyle(prediction);

  probabilityBar.style.width = `${probability * 100}%`;

  result.style.display = "block";
}

function showError() {
  result.className = "result neutral";
  result.innerHTML = `
    ❌ No se pudo analizar el texto.<br/>
    Intenta nuevamente.
  `;
  result.style.display = "block";
}

function applySentimentStyle(prediction) {
  result.className = "result";

  if (prediction === "Positivo") {
    result.classList.add("positive");
    probabilityBar.style.background = "#198754";
  } else if (prediction === "Negativo") {
    result.classList.add("negative");
    probabilityBar.style.background = "#dc3545";
  } else {
    result.classList.add("neutral");
    probabilityBar.style.background = "#6c757d";
  }
}
