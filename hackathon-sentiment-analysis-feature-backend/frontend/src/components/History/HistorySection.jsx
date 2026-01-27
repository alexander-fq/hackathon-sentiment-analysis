import React, { useState, useEffect } from 'react';
import { sentimentService } from '../../services/sentimentService';

const HistorySection = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await sentimentService.getHistory();
      setHistory(data);
      setFilteredHistory(data);
      setActiveFilter('Todos');
    } catch (err) {
      console.error('Error al cargar historial:', err);
      setError('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const filterByPrediction = async (prediction) => {
    if (prediction === 'Todos') {
      setFilteredHistory(history);
      setActiveFilter('Todos');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await sentimentService.getHistoryByPrediction(prediction);
      setFilteredHistory(data);
      setActiveFilter(prediction);
    } catch (err) {
      console.error('Error al filtrar:', err);
      setError('Error al filtrar el historial');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (prediction) => {
    const colors = {
      'Positivo': 'text-sentiment-pos bg-sentiment-pos/10 border-sentiment-pos/20',
      'Neutro': 'text-sentiment-neu bg-sentiment-neu/10 border-sentiment-neu/20',
      'Negativo': 'text-sentiment-neg bg-sentiment-neg/10 border-sentiment-neg/20'
    };
    return colors[prediction] || colors['Neutro'];
  };

  const getSentimentEmoji = (prediction) => {
    const emojis = {
      'Positivo': '😊',
      'Neutro': '😐',
      'Negativo': '😔'
    };
    return emojis[prediction] || '😐';
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filterButtons = ['Todos', 'Positivo', 'Neutro', 'Negativo'];

  return (
    <section className="px-6 py-20 lg:px-20" id="history">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Historial de Análisis</h2>
            <div className="mt-2 h-1 w-20 rounded-full bg-primary"></div>
          </div>
          <button
            onClick={loadHistory}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Actualizar
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-wrap gap-3">
          {filterButtons.map((filter) => (
            <button
              key={filter}
              onClick={() => filterByPrediction(filter)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">
              progress_activity
            </span>
          </div>
        )}

        {/* Lista de historial */}
        {!loading && filteredHistory.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No hay análisis en el historial
          </div>
        )}

        {!loading && filteredHistory.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="glass rounded-2xl p-6 hover:bg-white/[0.05] transition-all border-white/5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 mb-2">{truncateText(item.text)}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {new Date(item.createdAt).toLocaleString('es-ES')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getSentimentColor(item.prediction)}`}>
                      <span className="text-xl">{getSentimentEmoji(item.prediction)}</span>
                      <span className="font-bold text-sm">{item.prediction}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Confianza</div>
                      <div className="text-lg font-bold">{(item.probability * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HistorySection;
