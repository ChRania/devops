# Application d'authentification (React + Express + PostgreSQL)

## 1. Prérequis
- Node.js LTS
- PostgreSQL (retenez le mot de passe de l'utilisateur `postgres`)

Créez la base dans SQL Shell (psql) :

    CREATE DATABASE auth_db;

La table `users` est créée automatiquement au démarrage du backend.

## 2. Configuration
Ouvrez `backend/.env` et remplacez `VOTRE_MOT_DE_PASSE` par votre mot de passe PostgreSQL.

## 3. Lancement (2 terminaux dans VS Code)

Terminal 1 :

    cd backend
    npm install
    npm run dev

Terminal 2 :

    cd frontend
    npm install
    npm run dev

Ouvrez http://localhost:5173

## Dépannage
- `password authentication failed` : mot de passe incorrect dans `backend/.env`.
- `database "auth_db" does not exist` : exécutez `CREATE DATABASE auth_db;`.
- `ECONNREFUSED 5432` : démarrez le service PostgreSQL (services.msc).
- Si `bcrypt` ne s'installe pas : `npm uninstall bcrypt && npm install bcryptjs`, puis remplacez `from "bcrypt"` par `from "bcryptjs"` dans `server.js`.
