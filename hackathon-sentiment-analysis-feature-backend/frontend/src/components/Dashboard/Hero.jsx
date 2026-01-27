import React from 'react';

const Hero = () => {
  return (
    <section className="relative px-6 pt-24 pb-16 lg:px-20 hero-glow">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          Hackathon 2026 - v2.0 Released
        </div>
        
        <h1 className="mb-6 text-5xl font-black leading-tight tracking-tighter md:text-7xl">
          Análisis de Sentimientos <br/>
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent italic">
            Inteligente
          </span>
        </h1>
        
        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400">
          Potenciado por una arquitectura robusta de{' '}
          <span className="text-white font-semibold">Spring Boot</span>, la agilidad de{' '}
          <span className="text-white font-semibold">FastAPI</span> y modelos de{' '}
          <span className="text-white font-semibold">scikit-learn</span>.
        </p>
      </div>
    </section>
  );
};

export default Hero;
