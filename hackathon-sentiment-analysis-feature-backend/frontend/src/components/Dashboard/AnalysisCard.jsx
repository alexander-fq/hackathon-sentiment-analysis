import React, { useState } from 'react';
import { sentimentService } from '../../services/sentimentService';
import LanguageSelector from './LanguageSelector';
import ResultsCard from './ResultsCard';

const AnalysisCard = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('es');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    // Validaciones
    if (!text.trim()) {
      setError('Por favor, introduce un texto para analizar');
      return;
    }

    if (text.trim().length < 5) {
      setError('El texto debe tener al menos 5 caracteres');
      return;
    }

    if (text.length > 5000) {
      setError('El texto no debe exceder los 5000 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await sentimentService.analyzeSentiment({ text, language });
      setResults(data);
    } catch (err) {
      console.error('Error al analizar:', err);
      if (err.response?.status === 503) {
        setError('El servicio de análisis no está disponible. Verifica que FastAPI esté corriendo.');
      } else if (err.response?.status === 422) {
        setError('Error de validación: ' + (err.response.data.message || 'Datos inválidos'));
      } else {
        setError('Error al conectar con el servidor. Asegúrate de que la API esté corriendo en http://localhost:8080');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl+Enter o Cmd+Enter para analizar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const charCount = text.length;
  const maxChars = 5000;

  return (
    <section className="px-6 pb-20 lg:px-20" id="demo">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Análisis de sentimiento</h2>
        </div>
        
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
          {/* Selector de Idioma */}
          <LanguageSelector language={language} onChange={setLanguage} />

          {/* Textarea */}
          <div className="relative mt-10">
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[220px] w-full resize-none rounded-2xl border border-white/5 bg-black/40 p-8 text-xl text-slate-200 placeholder:text-slate-600 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="Introduce el texto que deseas analizar para detectar su carga emocional..."
            />
            {/* Contador de caracteres */}
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
              {charCount} / {maxChars}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Botón de análisis */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className={`flex h-2.5 w-2.5 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-sentiment-pos'} shadow-[0_0_8px_rgba(16,185,129,0.5)]`}></span>
              {loading ? 'Procesando...' : 'Listo para procesar'}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="w-full sm:w-auto flex h-14 px-10 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-accent-purple text-lg font-bold text-white shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Analizando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">analytics</span>
                  Analizar Sentimiento
                </>
              )}
            </button>
          </div>

          {/* Resultados */}
          <ResultsCard data={results} />
        </div>
      </div>
    </section>
  );
};

export default AnalysisCard;
