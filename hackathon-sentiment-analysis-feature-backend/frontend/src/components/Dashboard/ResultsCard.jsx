import React from 'react';

const ResultsCard = ({ data }) => {
  if (!data) return null;

  const { prediction, probability, probabilitiesDetail, language, timestamp } = data;

  // Configuración de sentimientos
  const sentimentConfig = {
    'Positivo': {
      emoji: '😊',
      color: 'text-sentiment-pos',
      bgColor: 'bg-sentiment-pos',
      borderColor: 'border-t-sentiment-pos border-r-sentiment-pos'
    },
    'Neutro': {
      emoji: '😐',
      color: 'text-sentiment-neu',
      bgColor: 'bg-sentiment-neu',
      borderColor: 'border-t-sentiment-neu border-r-sentiment-neu'
    },
    'Negativo': {
      emoji: '😔',
      color: 'text-sentiment-neg',
      bgColor: 'bg-sentiment-neg',
      borderColor: 'border-t-sentiment-neg border-r-sentiment-neg'
    }
  };

  const config = sentimentConfig[prediction] || sentimentConfig['Neutro'];

  // Formatear timestamp
  const formattedDate = new Date(timestamp).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Formatear idioma
  const languageLabel = language === 'es' ? 'Español' : 'English';

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de Resultado con Emoji */}
        <div className="glass rounded-2xl p-6 text-center border-white/5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">
            Resultado
          </span>
          <div className="text-5xl mb-2">{config.emoji}</div>
          <div className={`text-2xl font-black ${config.color}`}>
            {prediction.toUpperCase()}
          </div>
        </div>

        {/* Card de Confianza */}
        <div className="glass rounded-2xl p-6 text-center border-white/5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">
            Confianza
          </span>
          <div className="relative mx-auto h-24 w-24">
            <div className="h-24 w-24 rounded-full border-8 border-white/5"></div>
            <div 
              className={`absolute inset-0 h-24 w-24 rounded-full border-8 border-transparent ${config.borderColor} rotate-45`}
              style={{
                transform: `rotate(${(probability * 360)}deg)`
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-bold">
                {(probability * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Card de Probabilidades Detalladas */}
        <div className="glass rounded-2xl p-6 border-white/5 flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">
            Probabilidades
          </span>
          <div className="space-y-3">
            {Object.entries(probabilitiesDetail).map(([key, value]) => {
              const percent = (value * 100).toFixed(1);
              const itemConfig = sentimentConfig[key];
              return (
                <div key={key}>
                  <div className="flex justify-between text-[10px] mb-1 font-bold">
                    <span>{key.substring(0, 3).toUpperCase()}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${itemConfig.bgColor} transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Información adicional: Idioma y Fecha */}
      <div className="mt-6 glass rounded-2xl p-4 border-white/5">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">language</span>
            <span>Idioma: <span className="text-white font-semibold">{languageLabel}</span></span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">schedule</span>
            <span>Fecha: <span className="text-white font-semibold">{formattedDate}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
