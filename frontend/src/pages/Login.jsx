import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Login incorrecto");

      const data = await res.json();
      localStorage.setItem("token", data.token);

      navigate("/dashboard"); // ✅ redirección correcta
    } catch (err) {
      alert("❌ Usuario o contraseña incorrectos");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">
      <form
        onSubmit={handleSubmit}
        className="glass-card w-full max-w-md p-8 rounded-2xl space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center">Iniciar Sesión</h2>

        <input
          name="username"
          placeholder="Usuario"
          onChange={handleChange}
          className="w-full input"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="w-full input"
          required
        />

        <button className="gradient-btn w-full py-4 rounded-full font-bold">
          INGRESAR
        </button>
      </form>
    </div>
  );
}
// ✅ Componente de login funcional con manejo de estado y redirección tras el login exitoso
/*Utilidadesde Login.jsx:
- Maneja estado del formulario
- Envía datos a la API
- Almacena token en localStorage
- Redirige a /dashboard tras login exitoso*/