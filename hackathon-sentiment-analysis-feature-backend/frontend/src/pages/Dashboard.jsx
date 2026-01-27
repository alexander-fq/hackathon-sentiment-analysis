import React from 'react';
import Header from '../components/Dashboard/Header';
import Hero from '../components/Dashboard/Hero';
import AnalysisCard from '../components/Dashboard/AnalysisCard';
import HistorySection from '../components/History/HistorySection';
import StatisticsSection from '../components/Statistics/StatisticsSection';
import Footer from '../components/Dashboard/Footer';

const Dashboard = () => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <AnalysisCard />
        <HistorySection />
        <StatisticsSection />
        
        {/* Sección de Capacidades */}
        <section className="px-6 py-20 lg:px-20" id="features">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Capacidades del Sistema</h2>
              <div className="mt-2 h-1 w-20 rounded-full bg-primary"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="glass flex flex-col gap-5 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:bg-white/[0.05] border-white/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-3xl">public</span>
                </div>
                <h3 className="text-xl font-bold">Soporte Multilingüe</h3>
                <p className="text-slate-400 leading-relaxed">
                  Detección y análisis automático en múltiples lenguajes con pre-procesamiento optimizado para variaciones regionales.
                </p>
              </div>
              
              <div className="glass flex flex-col gap-5 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:bg-white/[0.05] border-white/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h3 className="text-xl font-bold">IA Avanzada</h3>
                <p className="text-slate-400 leading-relaxed">
                  Modelos de Machine Learning entrenados con scikit-learn para clasificación precisa en 3 categorías de sentimiento.
                </p>
              </div>
              
              <div className="glass flex flex-col gap-5 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:bg-white/[0.05] border-white/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-3xl">speed</span>
                </div>
                <h3 className="text-xl font-bold">Análisis en Tiempo Real</h3>
                <p className="text-slate-400 leading-relaxed">
                  Procesamiento instantáneo con FastAPI y arquitectura asíncrona para resultados en menos de 1 segundo.
                </p>
              </div>
              
              <div className="glass flex flex-col gap-5 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:bg-white/[0.05] border-white/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-3xl">database</span>
                </div>
                <h3 className="text-xl font-bold">Historial Persistente</h3>
                <p className="text-slate-400 leading-relaxed">
                  Base de datos H2 integrada para almacenamiento de análisis y consulta histórica con filtros avanzados.
                </p>
              </div>
              
              <div className="glass flex flex-col gap-5 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:bg-white/[0.05] border-white/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-3xl">query_stats</span>
                </div>
                <h3 className="text-xl font-bold">Estadísticas Detalladas</h3>
                <p className="text-slate-400 leading-relaxed">
                  Dashboard con métricas visuales, gráficos interactivos y análisis de tendencias de sentimiento.
                </p>
              </div>
              
              <div className="glass flex flex-col gap-5 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:bg-white/[0.05] border-white/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-3xl">api</span>
                </div>
                <h3 className="text-xl font-bold">API REST Completa</h3>
                <p className="text-slate-400 leading-relaxed">
                  Endpoints documentados con Swagger/OpenAPI para integración fácil con otros sistemas y aplicaciones.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
