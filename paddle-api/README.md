# Paddle API

Backend Node.js + Express + Prisma pour l'application mobile Paddle.

## 🚀 Quick Start

### Prérequis

- Node.js 20+
- PostgreSQL 16+
- Redis (optionnel mais recommandé)
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables d'environnement dans .env
# Notamment DATABASE_URL

# Générer le client Prisma
npm run prisma:generate

# Créer et appliquer les migrations
npm run prisma:migrate

# (Optionnel) Seed la base de données
npm run prisma:seed
```

### Développement

```bash
# Démarrer en mode développement (avec hot reload)
npm run dev

# L'API sera disponible sur http://localhost:3000
```

### Production

```bash
# Compiler TypeScript
npm run build

# Démarrer le serveur de production
npm start
```

### Tests

```bash
# Lancer les tests
npm test

# Tests en mode watch
npm test:watch

# Coverage
npm test:coverage
```

## 📁 Structure du Projet

```
paddle-api/
├── src/
│   ├── config/           # Configuration (database, redis, etc.)
│   ├── controllers/      # Contrôleurs (logique des routes)
│   ├── services/         # Services (business logic)
│   ├── routes/           # Définition des routes Express
│   ├── middleware/       # Middleware (auth, error handling, etc.)
│   ├── utils/            # Utilitaires
│   ├── types/            # Types TypeScript
│   ├── jobs/             # Jobs background (emails, notifications)
│   └── index.ts          # Point d'entrée
│
├── prisma/
│   ├── schema.prisma     # Schéma de base de données
│   ├── migrations/       # Migrations
│   └── seed.ts           # Seed data
│
├── tests/                # Tests
├── logs/                 # Logs (généré)
└── dist/                 # Build (généré)
```

## 🔌 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Rafraîchir le token
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/forgot-password` - Demander un reset de mot de passe
- `POST /api/auth/reset-password` - Réinitialiser le mot de passe

### Utilisateurs

- `GET /api/users/me` - Récupérer mon profil
- `PUT /api/users/me` - Mettre à jour mon profil
- `DELETE /api/users/me` - Supprimer mon compte
- `GET /api/users/:id` - Récupérer un profil utilisateur
- `GET /api/users/search` - Rechercher des joueurs
- `GET /api/users/:id/statistics` - Récupérer les statistiques d'un joueur

### Matchs

- `GET /api/matches` - Lister les matchs
- `POST /api/matches` - Créer un match
- `GET /api/matches/:id` - Récupérer un match
- `PUT /api/matches/:id` - Mettre à jour un match
- `DELETE /api/matches/:id` - Supprimer un match
- `POST /api/matches/:id/join` - Rejoindre un match
- `POST /api/matches/:id/leave` - Quitter un match

### Réservations

- `GET /api/bookings` - Mes réservations
- `POST /api/bookings` - Créer une réservation
- `GET /api/bookings/:id` - Récupérer une réservation
- `PUT /api/bookings/:id` - Modifier une réservation
- `DELETE /api/bookings/:id` - Annuler une réservation

### Clubs & Terrains

- `GET /api/clubs` - Lister les clubs
- `GET /api/clubs/:id` - Récupérer un club
- `GET /api/clubs/:id/courts` - Terrains d'un club
- `GET /api/courts/:id/availability` - Disponibilité d'un terrain

### Abonnements

- `GET /api/subscriptions/plans` - Plans d'abonnement
- `POST /api/subscriptions/subscribe` - S'abonner
- `POST /api/subscriptions/cancel` - Annuler
- `POST /api/subscriptions/webhooks/stripe` - Webhook Stripe

### Notifications

- `GET /api/notifications` - Mes notifications
- `PUT /api/notifications/:id/read` - Marquer comme lu
- `PUT /api/notifications/read-all` - Tout marquer comme lu

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

**Format du header:**

```
Authorization: Bearer <access_token>
```

**Tokens:**

- **Access Token:** Valide 15 minutes
- **Refresh Token:** Valide 7 jours

Utilisez le endpoint `/api/auth/refresh` pour renouveler l'access token.

## 🗄️ Base de Données

### Migrations

```bash
# Créer une migration
npm run prisma:migrate

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la base de données (DEV ONLY!)
npx prisma migrate reset
```

### Prisma Studio

```bash
# Ouvrir Prisma Studio (interface graphique)
npm run prisma:studio
```

## 🔧 Variables d'Environnement

Voir `.env.example` pour la liste complète des variables d'environnement requises.

**Variables essentielles:**

- `DATABASE_URL` - URL de connexion PostgreSQL
- `JWT_SECRET` - Secret pour les JWT
- `JWT_REFRESH_SECRET` - Secret pour les refresh tokens
- `PORT` - Port du serveur (défaut: 3000)
- `NODE_ENV` - Environnement (development/production)

## 📊 Monitoring & Logs

Les logs sont stockés dans le dossier `logs/`:

- `error.log` - Logs d'erreur uniquement
- `combined.log` - Tous les logs

En production, utilisez un service comme Sentry pour le monitoring des erreurs.

## 🚢 Déploiement

### Railway

```bash
# Connecter votre repo à Railway
# Les variables d'environnement seront configurées dans le dashboard
# Railway détectera automatiquement le projet Node.js
```

### Heroku

```bash
heroku create paddle-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set NODE_ENV=production
git push heroku main
```

### Docker

```dockerfile
# Dockerfile fourni
docker build -t paddle-api .
docker run -p 3000:3000 paddle-api
```

## 📝 Licence

MIT

## 👥 Équipe

Paddle App Team
