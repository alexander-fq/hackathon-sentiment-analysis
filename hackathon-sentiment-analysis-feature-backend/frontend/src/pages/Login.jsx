import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login(credentials);
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.message || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      {/* Efectos de fondo */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/15 blur-[120px] pointer-events-none opacity-50"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] pointer-events-none opacity-30"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-white/10 bg-background-dark/50 px-4 md:px-10 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(19,19,236,0.5)]">
            <span className="material-symbols-outlined text-white text-[24px]">analytics</span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">
            Sentimientos <span className="text-primary">v2.0</span>
          </h2>
        </div>
        <Link
          to="/dashboard"
          className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-full h-10 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          Ir al Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-[460px]">
          <div className="glass rounded-[24px] p-8 md:p-12 shadow-[0_20px_50px_rgba(19,19,236,0.25)] flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-white tracking-tight text-3xl font-extrabold pb-2">
                Iniciar Sesión
              </h1>
              <p className="text-white/60 text-base font-normal">
                Accede a tu panel de análisis
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Campo Username */}
              <div className="flex flex-col gap-2">
                <label className="text-white/90 text-sm font-semibold ml-1">Usuario</label>
                <div className="group relative flex w-full items-stretch rounded-xl overflow-hidden transition-all">
                  <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 border border-white/10 bg-white/5 text-white placeholder:text-white/30 h-14 px-4 pr-12 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base font-normal leading-normal"
                    placeholder="tu_usuario"
                    disabled={loading}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                </div>
              </div>

              {/* Campo Password */}
              <div className="flex flex-col gap-2">
                <label className="text-white/90 text-sm font-semibold ml-1">Contraseña</label>
                <div className="group relative flex w-full items-stretch rounded-xl overflow-hidden transition-all">
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 border border-white/10 bg-white/5 text-white placeholder:text-white/30 h-14 px-4 pr-12 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base font-normal leading-normal"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-primary to-[#7c3aed] text-white font-bold text-lg rounded-xl shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Iniciando...
                  </>
                ) : (
                  <>
                    <span>Acceder</span>
                    <span className="material-symbols-outlined text-[20px]">login</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-white/50 text-sm">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-primary hover:underline font-bold ml-1">
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center items-center gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Secure Auth</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">cloud</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Spring Boot API</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-white/30 text-xs tracking-wide relative z-10">
        © 2026 Sentimientos v2.0 - Advanced Sentiment Analytics Engine
      </footer>
    </div>
  );
};

export default Login;
