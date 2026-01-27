import api from './api';

export const sentimentService = {
  // Analizar sentimiento de un texto
  analyzeSentiment: async ({ text, language }) => {
    const response = await api.post('/api/sentiment', { text, language });
    return response.data;
  },

  // Obtener historial completo (últimos 10 análisis)
  getHistory: async () => {
    const response = await api.get('/api/sentiment/history');
    return response.data;
  },

  // Obtener historial filtrado por sentimiento
  getHistoryByPrediction: async (prediction) => {
    const response = await api.get(`/api/sentiment/history/${prediction}`);
    return response.data;
  },

  // Obtener estadísticas de sentimientos
  getStatistics: async () => {
    const response = await api.get('/api/sentiment/statistics');
    return response.data;
  }
};
