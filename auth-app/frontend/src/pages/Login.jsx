import { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/Field.jsx";
import { post } from "../api.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "L'email est obligatoire.";
    else if (!EMAIL_REGEX.test(form.email.trim())) e.email = "Format d'email invalide.";
    if (!form.password) e.password = "Le mot de passe est obligatoire.";
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setAlert(null);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      const data = await post("/api/login", form);
      setAlert({ type: "success", text: `Connexion réussie. Bienvenue ${data.user.name} !` });
    } catch (err) {
      setErrors(err.errors || {});
      setAlert({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="card">
        <h1>Connexion</h1>
        <p className="subtitle">Heureux de vous revoir. Connectez-vous à votre compte.</p>

        {alert && <div className={`alert ${alert.type}`}>{alert.text}</div>}

        <form onSubmit={onSubmit} noValidate>
          <Field
            label="Email"
            id="email"
            type="email"
            placeholder="vous@exemple.com"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            error={errors.email}
          />
          <Field
            label="Mot de passe"
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={form.password}
            onChange={onChange}
            error={errors.password}
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="switch">
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </main>
  );
}
