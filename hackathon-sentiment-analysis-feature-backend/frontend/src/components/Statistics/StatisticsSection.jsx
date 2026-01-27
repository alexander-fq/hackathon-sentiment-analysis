import React, { useState, useEffect } from 'react';
import { sentimentService } from '../../services/sentimentService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatisticsSection = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await sentimentService.getStatistics();
      setStatistics(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">
              progress_activity
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!statistics) {
    return null;
  }

  const total = (statistics.Positivo || 0) + (statistics.Neutro || 0) + (statistics.Negativo || 0);

  // Datos para el gráfico de barras
  const barData = [
    { name: 'Positivo', value: statistics.Positivo || 0, color: '#10b981' },
    { name: 'Neutro', value: statistics.Neutro || 0, color: '#64748b' },
    { name: 'Negativo', value: statistics.Negativo || 0, color: '#ef4444' }
  ];

  // Datos para el gráfico de pastel
  const pieData = barData.filter(item => item.value > 0);
  const COLORS = ['#10b981', '#64748b', '#ef4444'];

  return (
    <section className="px-6 py-20 lg:px-20 bg-white/[0.01]" id="statistics">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Estadísticas</h2>
            <div className="mt-2 h-1 w-20 rounded-full bg-primary"></div>
          </div>
          <button
            onClick={loadStatistics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Actualizar
          </button>
        </div>

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass rounded-2xl p-6 text-center border-white/5">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">analytics</span>
            <div className="text-4xl font-black text-white mb-1">{total}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Total Análisis</div>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center border-white/5">
            <span className="text-4xl mb-2">😊</span>
            <div className="text-4xl font-black text-sentiment-pos mb-1">{statistics.Positivo || 0}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Positivos</div>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center border-white/5">
            <span className="text-4xl mb-2">😐</span>
            <div className="text-4xl font-black text-sentiment-neu mb-1">{statistics.Neutro || 0}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Neutros</div>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center border-white/5">
            <span className="text-4xl mb-2">😔</span>
            <div className="text-4xl font-black text-sentiment-neg mb-1">{statistics.Negativo || 0}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Negativos</div>
          </div>
        </div>

        {/* Gráficos */}
        {total > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gráfico de Barras */}
            <div className="glass rounded-2xl p-8 border-white/5">
              <h3 className="text-xl font-bold mb-6 text-center">Distribución por Tipo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 12, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" fill="#1313ec" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Pastel */}
            <div className="glass rounded-2xl p-8 border-white/5">
              <h3 className="text-xl font-bold mb-6 text-center">Proporción de Sentimientos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 12, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {total === 0 && (
          <div className="glass rounded-2xl p-12 text-center border-white/5">
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">
              bar_chart
            </span>
            <p className="text-slate-400 text-lg">
              No hay datos suficientes para mostrar estadísticas.
              <br />
              Realiza algunos análisis para ver las estadísticas.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StatisticsSection;
