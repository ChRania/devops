import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import pool, { initDb } from "./db.js";

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json());

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- Inscription ----------
app.post("/api/register", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  const errors = {};
  if (name.length < 2) errors.name = "Le nom doit contenir au moins 2 caractères.";
  if (!EMAIL_REGEX.test(email)) errors.email = "Adresse email invalide.";
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = "Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre.";
  }
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Veuillez corriger les champs en erreur.", errors });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hash]
    );
    res.status(201).json({ message: "Compte créé avec succès.", user: rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        message: "Cet email est déjà utilisé.",
        errors: { email: "Cet email est déjà utilisé." },
      });
    }
    console.error(err);
    res.status(500).json({ message: "Erreur serveur. Veuillez réessayer." });
  }
});

// ---------- Connexion ----------
app.post("/api/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!EMAIL_REGEX.test(email) || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }

  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email]
    );
    const user = rows[0];
    const valid = user && (await bcrypt.compare(password, user.password_hash));

    if (!valid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }
    res.json({
      message: "Connexion réussie.",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur. Veuillez réessayer." });
  }
});

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => app.listen(PORT, () => console.log(`API démarrée sur http://localhost:${PORT}`)))
  .catch((err) => {
    console.error("Connexion à PostgreSQL impossible :", err.message);
    process.exit(1);
  });
