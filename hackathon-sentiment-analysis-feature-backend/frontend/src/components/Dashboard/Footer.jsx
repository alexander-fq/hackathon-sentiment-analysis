import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-background-dark px-6 py-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <h2 className="text-xl font-black tracking-tight">
                Sentimientos <span className="text-primary">v2.0</span>
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Sistema de análisis de sentimientos con IA para detectar emociones en textos.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Producto</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#demo" className="hover:text-white transition-colors">Análisis</a></li>
              <li><a href="#history" className="hover:text-white transition-colors">Historial</a></li>
              <li><a href="#statistics" className="hover:text-white transition-colors">Estadísticas</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Capacidades</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Tecnologías</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>React + Vite</li>
              <li>Spring Boot</li>
              <li>FastAPI</li>
              <li>scikit-learn</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Documentación API
                </a>
              </li>
              <li>
                <a href="http://localhost:8080/h2-console" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Base de Datos
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-white/5 pt-8 text-center text-sm text-slate-500">
          © 2026 Sentimientos v2.0 - Hackathon Project. Desarrollado con React, Spring Boot y FastAPI.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
