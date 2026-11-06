import { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/Field.jsx";
import { post } from "../api.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Le nom doit contenir au moins 2 caractères.";
    if (!form.email.trim()) e.email = "L'email est obligatoire.";
    else if (!EMAIL_REGEX.test(form.email.trim())) e.email = "Format d'email invalide.";
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      e.password = "Au moins 8 caractères, dont une lettre et un chiffre.";
    }
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
      await post("/api/register", form);
      setAlert({ type: "success", text: "Compte créé avec succès. Vous pouvez maintenant vous connecter." });
      setForm({ name: "", email: "", password: "" });
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
        <h1>Inscription</h1>
        <p className="subtitle">Créez votre compte en quelques secondes.</p>

        {alert && <div className={`alert ${alert.type}`}>{alert.text}</div>}

        <form onSubmit={onSubmit} noValidate>
          <Field
            label="Nom"
            id="name"
            type="text"
            placeholder="Votre nom"
            autoComplete="name"
            value={form.name}
            onChange={onChange}
            error={errors.name}
          />
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
            placeholder="8 caractères minimum"
            autoComplete="new-password"
            value={form.password}
            onChange={onChange}
            error={errors.password}
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Création..." : "S'inscrire"}
          </button>
        </form>

        <p className="switch">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </main>
  );
}
