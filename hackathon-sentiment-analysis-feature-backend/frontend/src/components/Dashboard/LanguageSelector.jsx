import React from 'react';

const LanguageSelector = ({ language, onChange }) => {
  return (
    <div className="absolute right-8 top-8 z-10 flex gap-2">
      <button
        onClick={() => onChange('es')}
        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all hover:scale-105 cursor-pointer ${
          language === 'es'
            ? 'bg-primary text-white shadow-lg shadow-primary/30'
            : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
        }`}
      >
        <span className="material-symbols-outlined text-sm">translate</span>
        Español
      </button>
      <button
        onClick={() => onChange('en')}
        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all hover:scale-105 cursor-pointer ${
          language === 'en'
            ? 'bg-primary text-white shadow-lg shadow-primary/30'
            : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
        }`}
      >
        <span className="material-symbols-outlined text-sm">language</span>
        English
      </button>
    </div>
  );
};

export default LanguageSelector;
