import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) throw new Error("Error en registro");

      alert("✅ Usuario registrado correctamente");
      navigate("/login"); // ✅ redirige después del registro
    } catch (err) {
      alert("❌ Error registrando usuario");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">
      <form
        onSubmit={handleSubmit}
        className="glass-card w-full max-w-md p-8 rounded-2xl space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center">Crear Cuenta</h2>

        <input
          name="username"
          placeholder="Usuario"
          onChange={handleChange}
          className="w-full input"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Correo"
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

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmar contraseña"
          onChange={handleChange}
          className="w-full input"
          required
        />

        <button className="gradient-btn w-full py-4 rounded-full font-bold">
          CREAR CUENTA
        </button>
      </form>
    </div>
  );
}
// ✅ Componente de registro funcional con validación de contraseñas y redirección tras el registro exitoso