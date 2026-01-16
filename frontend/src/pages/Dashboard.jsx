import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeSentiment } from "../api/sentimentApi";

export default function Dashboard() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [lang, setLang] = useState("es");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setLoading(true);
      const data = await analyzeSentiment(text, lang);
      setResult(data);
    } catch (err) {
      alert("❌ Error analizando el texto");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="gradient-btn px-6 py-3 rounded-full font-bold"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="glass-card max-w-2xl mx-auto p-8 rounded-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">
          Análisis de Sentimiento
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe aquí el texto a analizar..."
          className="w-full h-32 input resize-none"
        />

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="w-full input"
        >
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>

        <button
          disabled={loading}
          className="gradient-btn w-full py-4 rounded-full font-bold"
        >
          {loading ? "Analizando..." : "Analizar"}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="glass-card max-w-2xl mx-auto mt-8 p-6 rounded-2xl text-center">
          <p className="text-xl font-bold">
            Sentimiento:{" "}
            <span
              className={
                result.prediction === "Positivo"
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {result.prediction}
            </span>
          </p>

          <p className="mt-2">
            Probabilidad: {(result.probability * 100).toFixed(2)}%
          </p>

          <p className="text-sm text-gray-400 mt-2">
            {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}


//utilidadesde Dashboard.jsx:
// - Muestra título Dashboard
// - Botón cerrar sesión elimina token y redirige a /login
// Tailwind CSS classes used:
// - min-h-screen
// - bg-background-dark
// -dashboard protegido
// -Logout correcto
// -Sin refresh