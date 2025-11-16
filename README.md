# Paddle App

**Application mobile pour joueurs de paddle/padel** - Trouvez des partenaires, réservez des terrains, suivez vos performances.

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748.svg)](https://www.prisma.io/)

## 📱 Aperçu

Paddle App est une application mobile cross-platform (iOS/Android) qui permet aux joueurs de paddle de :

- 🎾 **Trouver des partenaires** de jeu selon leur niveau et localisation
- 📍 **Réserver des terrains** dans les clubs partenaires
- 📊 **Suivre leurs statistiques** et leur progression
- 💬 **Communiquer** avec d'autres joueurs
- 🏆 **Participer à des tournois** et matchs organisés
- 💳 **S'abonner** pour des fonctionnalités premium

## 🏗️ Architecture

Le projet est composé de deux applications principales :

- **`paddle-app/`** - Application mobile React Native
- **`paddle-api/`** - API Backend Node.js + Express + Prisma

## 🚀 Quick Start

### Prérequis

- Node.js 20+
- PostgreSQL 16+
- React Native CLI
- iOS: Xcode 15+ (Mac uniquement)
- Android: Android Studio

### Installation Backend

```bash
# Naviguer vers le dossier backend
cd paddle-api

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos variables

# Générer le client Prisma
npm run prisma:generate

# Créer la base de données et appliquer les migrations
npm run prisma:migrate

# Démarrer le serveur de développement
npm run dev

# L'API sera accessible sur http://localhost:3000
```

### Installation Mobile

```bash
# Naviguer vers le dossier mobile
cd paddle-app

# Installer les dépendances
npm install

# iOS uniquement: Installer les pods
cd ios && pod install && cd ..

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos variables

# Démarrer Metro bundler
npm start

# Dans un autre terminal, lancer l'app
# iOS:
npm run ios

# Android:
npm run android
```

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Guide complet pour les assistants IA
- **[Document Technique](./Document_Technique_PaddleApp.md)** - Spécifications techniques détaillées
- **[Document Fonctionnel](./Document_Fonctionnel_Business_PaddleApp.md)** - Spécifications fonctionnelles et business
- **[Guide de Développement](./Guide_Developpement_Web_Claude.md)** - Guide pour le développement web

### READMEs Spécifiques

- [Backend README](./paddle-api/README.md)
- Mobile README (à créer)

## 🛠️ Stack Technologique

### Mobile (React Native)

- React Native 0.74
- TypeScript 5.3
- Redux Toolkit + React Query
- React Navigation 6
- React Native Paper (UI)
- React Hook Form + Zod
- Axios + Socket.io

### Backend (Node.js)

- Node.js 20 LTS
- Express.js 4.x
- TypeScript 5.3
- PostgreSQL 16 + Prisma 5.x
- JWT Authentication
- Socket.io (WebSocket)
- Winston (Logging)

### Services Externes

- Stripe (Paiements & Abonnements)
- Firebase (Push Notifications, Analytics)
- AWS S3 (Stockage fichiers)
- Sentry (Error Tracking)

## 🎨 Design System

- **Couleur Primaire:** #0066FF (Bleu électrique)
- **Couleur Secondaire:** #00D084 (Vert paddle)
- **Couleur Accent:** #FF6B35 (Orange énergique)
- **Système de Spacing:** Grille de 8pt
- **Typographie:** SF Pro (iOS), Roboto (Android)

## 📦 Fonctionnalités Principales

### ✅ Backend Complet (Sprint 1 + Sprint 2)

- [x] Architecture du projet (Backend + Mobile)
- [x] Design system complet
- [x] Authentification JWT + OAuth (Google, Apple, Facebook)
- [x] Authentification biométrique (Face ID, Touch ID)
- [x] Navigation React Navigation
- [x] Redux store configuration
- [x] Schéma de base de données Prisma
- [x] API d'authentification (7 endpoints)
- [x] Middleware de sécurité
- [x] Système d'abonnement Stripe (8 endpoints)
- [x] Notifications push Firebase (5 endpoints)
- [x] Chat en temps réel Socket.io (12 endpoints)
- [x] Géolocalisation et cartes (6 endpoints)
- [x] Gestion complète des matchs (14 endpoints)
- [x] Système de réservation (13 endpoints)
- [x] Système de tournois (10 endpoints)
- [x] Email transactionnel (Nodemailer)
- [x] Services de paiement (Stripe)
- [x] 85+ API endpoints opérationnels

### 🚧 En Cours (Sprint 3 - UI Integration)

- [x] Composants UI de base (7 composants communs)
- [x] Écrans d'authentification (Login, SignUp, Onboarding, ForgotPassword)
- [x] Écran d'accueil (Dashboard)
- [x] Écran de recherche
- [x] Écran de profil
- [x] Écran de matchs (liste avec tabs)
- [x] Écran de paramètres (More/Settings avec 5 sections)
- [x] Écran d'abonnement (plan comparison avec Stripe)
- [ ] Écrans de réservation (4 screens)
- [ ] Écrans de tournois (5 screens)
- [ ] Écran de détails de match (1 screen)
- [ ] Écrans de statistiques (3 screens)
- [ ] Écrans de chat (3 screens)

### 📋 À Développer (Sprint 4+)

- [ ] Upload de photos/vidéos
- [ ] Analyse vidéo (IA Premium)
- [ ] Coaching IA (Premium)
- [ ] Système de notation/reviews
- [ ] Panels d'administration
- [ ] Analytics avancées
- [ ] Fonctionnalités sociales avancées

## 💰 Modèle Business

**Freemium avec abonnements mensuels :**

- **Gratuit** : Profil basique, recherche limitée (5/mois), publicités
- **Standard** (9.99€/mois) : Recherche illimitée, réservations, statistiques, sans pub
- **Premium** (14.99€/mois) : Analyse vidéo, coaching IA, priorité tournois

**Objectifs :**
- 6 mois : 10,000 téléchargements, 1,000 abonnés
- 12 mois : 50,000 téléchargements, 6,000 abonnés, 60,000€ MRR

## 🧪 Tests

### Backend

```bash
cd paddle-api

# Tests unitaires
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Mobile

```bash
cd paddle-app

# Tests unitaires
npm test

# Tests E2E (Detox)
npm run detox:build:ios
npm run detox:test:ios
```

## 🚢 Déploiement

### Backend

**Recommandé : Railway.app**

1. Connecter le repo GitHub
2. Configurer les variables d'environnement
3. Déploiement automatique sur push

**Alternatives :** Heroku, AWS, DigitalOcean

### Mobile

**iOS :**
1. Archive avec Xcode
2. Upload sur App Store Connect
3. Soumission pour review

**Android :**
1. Build APK: `cd android && ./gradlew assembleRelease`
2. Upload sur Google Play Console
3. Soumission pour review

## 📄 Licence

MIT

## 👥 Équipe

- **Développement:** Claude AI Assistant
- **Documentation:** Basée sur les spécifications techniques et fonctionnelles

## 🤝 Contribution

Ce projet a été développé avec l'assistance de Claude AI. Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'feat: add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème :

- Consulter la [documentation](./CLAUDE.md)
- Vérifier les [issues existantes](../../issues)
- Créer une nouvelle issue si nécessaire

## 🎯 Roadmap

**✅ Phase 1 (MVP Backend - COMPLETE!) :** Authentification, OAuth, Stripe, Firebase, Socket.io
**✅ Phase 2 (Core Features - COMPLETE!) :** Chat, Géolocalisation, Matchs, Réservations, Tournois
**🚀 Phase 3 (UI Integration - IN PROGRESS) :** Écrans de booking, tournois, match, stats, chat
**Phase 4 (Premium - À venir) :** Analyse vidéo IA, Coaching, Features premium avancées

---

**Développé avec ❤️ et 🎾 par l'équipe Paddle App**

Version 1.9.0-dev | Dernière mise à jour : 16 Novembre 2025 | Sprint 3 Starting!
