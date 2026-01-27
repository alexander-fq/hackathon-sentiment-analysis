import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background-dark/80 backdrop-blur-md px-6 lg:px-20 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined">analytics</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">
            Sentimientos <span className="text-primary">v2.0</span>
          </h2>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('demo')}
            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
          >
            Análisis
          </button>
          <button
            onClick={() => scrollToSection('history')}
            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
          >
            Historial
          </button>
          <button
            onClick={() => scrollToSection('statistics')}
            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
          >
            Estadísticas
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
          >
            Capacidades
          </button>
        </nav>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-400 hidden sm:inline">
                Hola, <span className="text-white font-semibold">{user?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center rounded-lg bg-white/5 border border-white/10 px-5 py-2 text-sm font-bold transition-all hover:bg-white/10"
              >
                <span className="material-symbols-outlined mr-2">logout</span>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-bold text-primary/80 transition-all hover:text-primary hover:underline underline-offset-4"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center rounded-lg bg-white/5 border border-white/10 px-5 py-2 text-sm font-bold transition-all hover:bg-white/10"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
