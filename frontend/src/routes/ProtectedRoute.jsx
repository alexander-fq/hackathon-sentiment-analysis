import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
/*Utilidadesde ProtectedRoute.jsx:
- Verifica token en localStorage
- Redirige si no hay token
- Renderiza children si hay token
Usuario abre /dashboard
│
├─ ¿Hay token?
│    ├─ ❌ NO → /login
│    └─ ✅ SÍ → Dashboard*/