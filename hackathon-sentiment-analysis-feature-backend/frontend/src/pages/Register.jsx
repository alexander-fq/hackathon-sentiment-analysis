import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    return strength;
  };

  const getStrengthLabel = (strength) => {
    if (strength === 0) return { label: 'Muy Débil', color: 'from-red-500 to-red-600', textColor: 'text-red-500' };
    if (strength <= 25) return { label: 'Débil', color: 'from-red-500 to-orange-500', textColor: 'text-orange-500' };
    if (strength <= 50) return { label: 'Media', color: 'from-orange-500 to-yellow-500', textColor: 'text-yellow-500' };
    if (strength <= 75) return { label: 'Buena', color: 'from-yellow-500 to-green-500', textColor: 'text-green-500' };
    return { label: 'Excelente', color: 'from-green-500 to-emerald-600', textColor: 'text-green-500' };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const strengthInfo = getStrengthLabel(passwordStrength);

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos');
      return false;
    }

    if (formData.username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor introduce un email válido');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        // Registro exitoso, redirigir a login
        navigate('/login', { state: { message: 'Registro exitoso. Por favor inicia sesión.' } });
      } else {
        setError(response.message || 'Error al registrar usuario');
      }
    } catch (err) {
      console.error('Error al registrar:', err);
      if (err.response?.status === 400) {
        setError('El usuario o email ya existe');
      } else {
        setError('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      {/* Efectos de fondo */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/15 blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] opacity-30"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background-dark/80 backdrop-blur-md px-6 md:px-20 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <span className="material-symbols-outlined text-white text-[24px]">analytics</span>
            </div>
            <h1 className="text-white text-xl font-bold tracking-tight">
              Sentimientos <span className="text-primary">v2.0</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Dashboard
            </Link>
            <Link
              to="/login"
              className="bg-primary/20 hover:bg-primary/30 text-white px-6 py-2 rounded-full text-sm font-bold border border-primary/30 transition-all"
            >
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 py-12 md:py-20 flex-1">
        <div className="text-center mb-10 max-w-[600px]">
          <h2 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Crear Cuenta
          </h2>
          <p className="text-gray-400 text-lg">
            Únete a la plataforma líder de análisis de sentimientos y potencia tus proyectos de IA.
          </p>
        </div>

        <div className="glass w-full max-w-[540px] p-8 md:p-12 rounded-[24px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-semibold ml-1">Nombre de Usuario</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person</span>
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-background-dark/50 border border-white/10 rounded-full py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-600"
                  placeholder="tu_usuario"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-semibold ml-1">Correo Electrónico</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-background-dark/50 border border-white/10 rounded-full py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-600"
                  placeholder="ejemplo@correo.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-semibold ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-background-dark/50 border border-white/10 rounded-full py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-500 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 px-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Seguridad</span>
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${strengthInfo.textColor}`}>
                      {strengthInfo.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${strengthInfo.color} rounded-full transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-semibold ml-1">Confirmar Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-background-dark/50 border border-white/10 rounded-full py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-full text-white font-extrabold text-sm tracking-widest uppercase mt-4 bg-gradient-to-r from-primary to-purple-600 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary hover:text-white font-bold transition-colors ml-1">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white">security</span>
            <span className="text-xs font-bold uppercase tracking-tighter text-white">Secure Data</span>
          </div>
          <div className="w-px h-4 bg-gray-500"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white">bolt</span>
            <span className="text-xs font-bold uppercase tracking-tighter text-white">Fast Analysis</span>
          </div>
          <div className="w-px h-4 bg-gray-500"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white">deployed_code</span>
            <span className="text-xs font-bold uppercase tracking-tighter text-white">API V2.0</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
