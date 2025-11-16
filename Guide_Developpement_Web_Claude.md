# GUIDE DE DÉVELOPPEMENT PADDLE APP VIA CLAUDE.AI WEB
## Développement Complet Sans Ligne de Commande

**Version:** 1.0  
**Date:** 16 Novembre 2025  
**Méthode:** Interface Web Claude.ai (sans installation locale)

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble de l'approche](#1-vue-densemble)
2. [Stratégie de développement web](#2-stratégie)
3. [Génération du code complet](#3-génération)
4. [Structure des prompts](#4-prompts)
5. [Workflow étape par étape](#5-workflow)
6. [Exemples concrets](#6-exemples)
7. [Téléchargement et déploiement](#7-déploiement)

---

## 1. VUE D'ENSEMBLE DE L'APPROCHE {#1-vue-densemble}

### 1.1 Ce que Claude.ai peut faire pour vous

Directement dans cette interface, Claude peut :

✅ **Générer tout le code source**
- Composants React Native complets
- Services API backend
- Schémas de base de données
- Configuration et fichiers de setup

✅ **Créer des fichiers individuels**
- Un fichier à la fois avec le bouton "Create file"
- Téléchargement direct via navigateur
- Organisation en structure de projet

✅ **Fournir le code en blocs copiables**
- Code formaté et prêt à copier
- Avec commentaires et explications
- Organisé par module

✅ **Itérer et corriger**
- Modifications en temps réel
- Debugging assisté
- Optimisations sur demande

❌ **Ce que Claude.ai ne peut PAS faire directement**
- Exécuter du code localement
- Installer des packages npm
- Compiler l'application
- Tester l'application

### 1.2 Stratégie Recommandée : Génération Progressive

**Option A : Génération Complète (Recommandée)**
1. Générer tous les fichiers du projet via Claude.ai
2. Télécharger les fichiers un par un
3. Reconstruire la structure localement
4. Installation et test en local

**Option B : Utilisation d'IDE en Ligne**
1. Utiliser StackBlitz, CodeSandbox ou GitHub Codespaces
2. Copier-coller le code généré
3. Tester directement dans le navigateur

**Option C : Hybrid (Plus Simple)**
1. Générer le code avec Claude.ai
2. Utiliser un template starter existant
3. Remplacer les fichiers par les versions générées

---

## 2. STRATÉGIE DE DÉVELOPPEMENT WEB {#2-stratégie}

### 2.1 Approche par Modules

Nous allons générer le projet module par module dans cet ordre :

**Phase 1 : Configuration de Base** (Jour 1)
1. package.json et dépendances
2. Configuration TypeScript
3. Structure de dossiers
4. Fichiers de configuration (Babel, Metro, etc.)

**Phase 2 : Backend API** (Jours 2-4)
1. Schéma Prisma
2. Configuration Express/Fastify
3. Routes d'authentification
4. Routes principales (users, matches, bookings)
5. Middleware et utils

**Phase 3 : Mobile App - Core** (Jours 5-8)
1. Navigation structure
2. Redux store setup
3. API client et services
4. Composants de base (Button, Input, Card)
5. Theme et design system

**Phase 4 : Mobile App - Features** (Jours 9-15)
1. Écrans d'authentification
2. Profil utilisateur
3. Recherche de joueurs
4. Réservations
5. Gestion des matchs
6. Messagerie

**Phase 5 : Intégrations** (Jours 16-20)
1. In-App Purchase
2. Notifications Push
3. Géolocalisation et Maps
4. Upload d'images
5. Analytics

### 2.2 Outils Externes Nécessaires

**Pour développer localement après génération :**
- Node.js 20+ (gratuit)
- Visual Studio Code (gratuit)
- Xcode (Mac, gratuit) ou Android Studio (gratuit)
- Git (gratuit)

**Alternatives sans installation locale :**
- **GitHub Codespaces** (60h/mois gratuit)
- **StackBlitz** (gratuit pour projets publics)
- **CodeSandbox** (gratuit avec limitations)
- **Replit** (gratuit avec limitations)

---

## 3. GÉNÉRATION DU CODE COMPLET {#3-génération}

### 3.1 Prompts Structurés pour Génération Complète

Je vais maintenant vous fournir une série de prompts que vous pouvez utiliser **dans cette conversation** pour générer tous les fichiers nécessaires.

### 3.2 Organisation de la Génération

**Méthode 1 : Fichier par Fichier**

Chaque prompt génère un fichier que Claude créera avec le bouton "Create file" :

```
Prompt : "Génère le fichier package.json complet pour le projet mobile React Native avec toutes les dépendances listées dans le document technique"
→ Claude crée : package.json
→ Vous téléchargez
```

**Méthode 2 : Par Module Complet**

Chaque prompt génère plusieurs fichiers d'un module :

```
Prompt : "Génère tous les fichiers du module d'authentification :
- LoginScreen.tsx
- SignUpScreen.tsx
- OnboardingScreen.tsx
- auth.service.ts
- authSlice.ts"
→ Claude crée 5 fichiers
→ Vous téléchargez
```

**Méthode 3 : Archive Complète**

```
Prompt : "Génère un script complet qui crée toute la structure du projet avec tous les fichiers de configuration"
→ Claude fournit un script shell
→ Vous exécutez en local
```

---

## 4. STRUCTURE DES PROMPTS {#4-prompts}

### 4.1 Template de Prompt Optimal

```
Génère [NOM DU FICHIER/MODULE] pour l'application Paddle avec :

CONTEXTE :
- [Rappel du contexte si nécessaire]

SPÉCIFICATIONS :
- [Fonctionnalité 1]
- [Fonctionnalité 2]
- [Fonctionnalité 3]

TECHNOLOGIES :
- [Framework/Library]
- [Autre technologie]

CONTRAINTES :
- TypeScript strict
- Respect du design system (couleurs #0066FF, spacing 8pt)
- Commentaires en français
- Gestion d'erreurs complète

INTÉGRATIONS :
- [API à appeler]
- [État Redux à utiliser]
- [Navigation vers...]

FORMAT SOUHAITÉ :
- Code complet et fonctionnel
- Avec imports
- Avec types TypeScript
- Prêt à l'emploi
```

### 4.2 Exemples de Prompts Prêts à l'Emploi

**Prompt 1 : Configuration Initiale**

```
Génère les fichiers de configuration suivants pour un projet React Native TypeScript :

1. package.json avec :
   - React Native 0.74
   - TypeScript 5.3
   - React Navigation 6
   - Redux Toolkit
   - React Query
   - Toutes les dépendances du document technique

2. tsconfig.json
   - Mode strict
   - Chemins absolus avec @/
   - Support React Native

3. babel.config.js
   - Preset React Native
   - Plugin Reanimated
   - Module resolver pour chemins absolus

4. metro.config.js
   - Configuration optimale

Fournis chaque fichier séparément avec le code complet.
```

**Prompt 2 : Structure de Dossiers**

```
Génère un script shell (setup.sh) qui crée toute la structure de dossiers du projet mobile selon l'architecture du document technique :

src/
├── api/
├── assets/
├── components/
├── navigation/
├── screens/
├── store/
├── hooks/
├── utils/
├── constants/
├── theme/
└── types/

Avec tous les sous-dossiers nécessaires et des fichiers .gitkeep pour Git.
```

**Prompt 3 : Schéma Prisma**

```
Génère le fichier schema.prisma complet avec tous les modèles définis dans le document technique :
- User avec toutes les relations
- Match et MatchParticipant
- Court et Club
- Booking
- Message et Conversation
- Review
- Payment
- Notification

Avec les enums, index, et relations correctes.
Code prêt à être utilisé avec Prisma migrate.
```

**Prompt 4 : Design System**

```
Génère les fichiers du design system :

1. src/theme/theme.ts
   - Couleurs (primaire #0066FF, secondaire #00D084, accent #FF6B35)
   - Spacing (système 8pt)
   - Border radius
   - Shadows
   - Animations

2. src/theme/typography.ts
   - Tailles (32/24/18/16/14pt)
   - Familles de polices iOS/Android
   - Line heights

3. src/constants/colors.ts
   - Palette complète
   - Mode sombre

Code TypeScript avec exports typés.
```

**Prompt 5 : Configuration Redux**

```
Génère la configuration Redux complète :

1. src/store/index.ts
   - Configure store avec Redux Toolkit
   - Redux Persist
   - Middleware
   - Type RootState

2. src/store/slices/authSlice.ts
   - État user, token, isAuthenticated
   - Actions login, logout, refresh
   - Reducers

3. src/store/slices/appSlice.ts
   - Theme, language, preferences
   - Actions et reducers

4. src/store/hooks.ts
   - useAppDispatch et useAppSelector typés

Code complet avec TypeScript.
```

**Prompt 6 : API Client**

```
Génère le client API complet :

1. src/api/axios.config.ts
   - Instance Axios configurée
   - Base URL depuis .env
   - Intercepteurs (auth token, refresh, erreurs)
   - Type pour les réponses

2. src/api/endpoints.ts
   - Toutes les URLs d'API en constantes

3. src/api/services/auth.service.ts
   - login(email, password)
   - register(userData)
   - loginWithGoogle(token)
   - logout()
   - refreshToken()

Utilise React Query pour le caching.
Gestion complète des erreurs.
Types TypeScript pour requêtes/réponses.
```

**Prompt 7 : Navigation**

```
Génère la structure de navigation complète :

1. src/navigation/types.ts
   - Types pour toutes les routes
   - Params pour chaque écran

2. src/navigation/RootNavigator.tsx
   - Navigation conditionnelle (auth vs main)

3. src/navigation/AuthNavigator.tsx
   - Stack : Login, SignUp, Onboarding

4. src/navigation/MainNavigator.tsx
   - Bottom Tab Navigator avec 5 tabs :
     - Home, Search, Matches, Profile, More
   - Icônes et couleurs du design system

Code React Navigation 6 avec TypeScript.
```

**Prompt 8 : Composants de Base**

```
Génère les composants réutilisables de base :

1. src/components/common/Button.tsx
   - Props : title, onPress, variant (primary/secondary/outline), loading, disabled
   - Styles selon design system
   - TypeScript strict

2. src/components/common/Input.tsx
   - Props : placeholder, value, onChangeText, error, secureTextEntry
   - Icônes optionnelles
   - Validation visuelle

3. src/components/common/Card.tsx
   - Container avec ombre légère
   - Padding, radius selon design system

4. src/components/common/Avatar.tsx
   - Image avec fallback initiales
   - Tailles : small, medium, large

Tous avec React.memo pour performance.
Utilise React Native Paper et styled-components.
```

**Prompt 9 : Écran de Login**

```
Génère l'écran de login complet :

src/screens/auth/LoginScreen.tsx

FONCTIONNALITÉS :
- Formulaire email/password avec react-hook-form + zod
- Boutons social login (Google, Apple, Facebook)
- Lien "Mot de passe oublié"
- Lien "S'inscrire"
- Loading states
- Gestion des erreurs avec messages
- Navigation vers Home après succès

INTÉGRATIONS :
- Redux pour stocker user/token
- API service auth.service.ts
- Navigation vers SignUpScreen et ForgotPasswordScreen

DESIGN :
- Respect du design system
- Animations avec Reanimated
- Keyboard avoiding view

Code complet avec TypeScript, commenté en français.
```

**Prompt 10 : Écran Home (Dashboard)**

```
Génère l'écran Home complet :

src/screens/home/HomeScreen.tsx

SECTIONS :
1. Header : Avatar + Nom + Niveau + Streak
2. Matchs à venir : Liste horizontale de MatchCard
3. Statistiques rapides : Grid 2x2 (Matchs joués, Win rate, Streak, Ranking)
4. Recommandations : 3 joueurs suggérés avec PlayerCard
5. Actualités : Derniers posts

FONCTIONNALITÉS :
- Pull to refresh
- Navigation vers chaque section
- Loading skeleton
- États vides avec messages

INTÉGRATIONS :
- React Query pour fetch data
- Redux pour user info
- Navigation vers MatchDetails, PlayerProfile

COMPOSANTS :
- Utilise MatchCard et PlayerCard
- Utilise FlashList pour performances

Code TypeScript avec commentaires.
```

---

## 5. WORKFLOW ÉTAPE PAR ÉTAPE {#5-workflow}

### 5.1 Processus de Génération Recommandé

**ÉTAPE 1 : Préparation (5 min)**

```
MOI : "Je suis prêt à générer l'application Paddle. 
Commençons par les fichiers de configuration.
Génère d'abord le package.json pour le mobile."

CLAUDE : [Crée le fichier package.json]

MOI : [Je télécharge le fichier]
```

**ÉTAPE 2 : Configuration (30 min)**

Générer dans cet ordre :
1. ✅ package.json (mobile)
2. ✅ tsconfig.json
3. ✅ babel.config.js
4. ✅ metro.config.js
5. ✅ .env.example
6. ✅ Script de setup (create-structure.sh)

**ÉTAPE 3 : Backend (2-3 heures)**

1. ✅ package.json (backend)
2. ✅ schema.prisma
3. ✅ Configuration Express
4. ✅ Middleware (auth, error, validation)
5. ✅ Services (auth, user, booking, match)
6. ✅ Routes
7. ✅ Utils

**ÉTAPE 4 : Mobile - Foundation (2-3 heures)**

1. ✅ Design system (theme, colors, typography)
2. ✅ Redux store configuration
3. ✅ Navigation structure
4. ✅ API client et services
5. ✅ Composants de base (Button, Input, Card, Avatar)

**ÉTAPE 5 : Mobile - Screens (4-6 heures)**

1. ✅ Auth screens (Login, SignUp, Onboarding)
2. ✅ Home/Dashboard
3. ✅ Profile screens
4. ✅ Search screens
5. ✅ Booking screens
6. ✅ Match screens
7. ✅ Settings

**ÉTAPE 6 : Révision et Tests (1 heure)**

1. ✅ Vérifier la cohérence
2. ✅ Demander corrections si besoin
3. ✅ Générer fichiers de test
4. ✅ Documentation README

### 5.2 Commandes pour Chaque Étape

**Session 1 : Configuration**

```
"Commence la génération. Première étape : 
Crée le package.json pour React Native 0.74 avec TypeScript 
et toutes les dépendances du document technique."
```

Puis :

```
"Maintenant le tsconfig.json avec configuration stricte 
et support des chemins absolus @/"
```

Puis :

```
"Génère babel.config.js avec plugin Reanimated 
et module resolver"
```

**Session 2 : Backend**

```
"Passons au backend. Génère le schema.prisma complet 
avec tous les modèles du document : User, Match, Court, 
Booking, Message, Review, Payment, Notification"
```

Puis :

```
"Génère le fichier src/index.ts du backend avec :
- Configuration Express
- Connexion Prisma
- Middleware (helmet, cors, express-json)
- Routes mounting
- Error handling
- Server start"
```

**Session 3 : Design System**

```
"Génère le design system complet :
1. src/theme/theme.ts avec couleurs et spacing
2. src/theme/typography.ts
3. src/constants/dimensions.ts

Respecte les spécifications :
- Primaire: #0066FF
- Secondaire: #00D084
- Accent: #FF6B35
- Spacing: 8pt system"
```

**Session 4 : Redux Setup**

```
"Configure Redux Toolkit avec :
1. Store setup avec Redux Persist
2. authSlice (login, logout, user state)
3. appSlice (theme, language, preferences)
4. Hooks typés (useAppDispatch, useAppSelector)

Code TypeScript strict."
```

**Session 5 : Screens - Batch**

```
"Génère maintenant 3 écrans d'authentification :

1. LoginScreen.tsx
2. SignUpScreen.tsx  
3. OnboardingScreen.tsx

Tous avec :
- React Hook Form + Zod validation
- Loading states
- Error handling
- Navigation
- Design system
- TypeScript

Fournis les 3 fichiers séparément."
```

### 5.3 Gestion des Fichiers Générés

**Téléchargement Organisé :**

1. Créer dossiers locaux :
```
paddle-app/
  ├── src/
  │   ├── screens/
  │   ├── components/
  │   └── ...
paddle-api/
  ├── src/
  │   ├── routes/
  │   └── ...
```

2. Télécharger chaque fichier dans le bon dossier

3. Alternative : Demander un fichier ZIP
```
"Peux-tu me fournir un script qui recrée 
toute la structure et tous les fichiers générés 
jusqu'ici ?"
```

---

## 6. EXEMPLES CONCRETS {#6-exemples}

### 6.1 Génération Complète d'un Module

**Exemple : Module de Recherche de Joueurs**

```
PROMPT :

"Génère le module complet de recherche de joueurs :

BACKEND :
1. src/routes/search.routes.ts
   - GET /api/search/players avec query params (level, location, radius)
   - Pagination
   - Tri par pertinence

2. src/services/search.service.ts
   - searchPlayers(filters)
   - Algorithme de matching
   - Requêtes Prisma optimisées avec select

MOBILE :
1. src/screens/search/SearchPlayersScreen.tsx
   - Barre de recherche
   - Filtres (niveau, distance, âge, disponibilité)
   - Liste de résultats avec FlashList
   - PlayerCard pour chaque résultat
   - Pull to refresh
   - Pagination infinie

2. src/components/features/PlayerCard.tsx
   - Avatar + nom + username
   - Niveau avec badge coloré
   - Distance
   - Rating étoiles
   - Bouton "Inviter"
   - onPress callback

3. src/components/features/SearchFilters.tsx
   - Bottom sheet avec filtres
   - Sliders, checkboxes, dropdowns
   - Reset filters
   - Apply button

4. src/api/services/search.service.ts
   - searchPlayers(query, filters)
   - Utilise React Query
   - Cache 5 min

TECHNOLOGIES :
- TypeScript strict
- React Query pour state serveur
- React Native Paper pour UI
- Reanimated pour animations

Fournis tous les fichiers avec code complet."
```

Claude générera alors 6 fichiers complets que vous pourrez télécharger !

### 6.2 Génération avec Itération

**Tour 1 :**
```
"Génère LoginScreen.tsx basique avec email/password"
```

**Tour 2 (après révision) :**
```
"Améliore LoginScreen.tsx :
- Ajoute validation en temps réel
- Ajoute animation au submit
- Ajoute biometric authentication (Face ID/Touch ID)
- Améliore les messages d'erreur"
```

**Tour 3 (personnalisation) :**
```
"Modifie les couleurs du LoginScreen pour utiliser 
notre palette custom et ajoute un dégradé au background"
```

### 6.3 Debugging Assisté

```
"J'ai une erreur dans LoginScreen.tsx :
'Cannot read property onPress of undefined'

Voici mon code :
[copier-coller le code]

Peux-tu identifier et corriger le problème ?"
```

Claude analysera et fournira la correction.

---

## 7. DÉPLOIEMENT SANS LIGNE DE COMMANDE {#7-déploiement}

### 7.1 Option A : GitHub + Codespaces (Recommandée)

**Étape 1 : Créer Repo GitHub**
1. Aller sur github.com
2. New Repository
3. Nommer "paddle-app"

**Étape 2 : Upload des Fichiers**
1. Upload tous les fichiers générés
2. Respecter la structure de dossiers

**Étape 3 : Ouvrir dans Codespaces**
1. Cliquer sur "Code" > "Codespaces" > "Create codespace"
2. Attend le chargement (2-3 min)

**Étape 4 : Installation**
```bash
# Dans le terminal Codespaces :
npm install
npm start
```

### 7.2 Option B : StackBlitz (Web Only)

**Pour tester le code rapidement :**

1. Aller sur stackblitz.com
2. Créer nouveau projet React
3. Copier-coller les fichiers générés
4. Test en temps réel dans le navigateur

**Limitations :**
- Pas de support complet React Native
- Bon pour tester la logique métier
- Bon pour le backend Node.js

### 7.3 Option C : Expo Snack (Pour React Native)

**Test rapide mobile :**

1. Aller sur snack.expo.dev
2. Copier-coller composants React Native
3. Tester sur émulateur web ou app Expo Go

**Limitations :**
- Dépendances limitées
- Pas toutes les features natives

### 7.4 Déploiement Backend

**Via Railway.app (Sans CLI) :**

1. Aller sur railway.app
2. "New Project" > "Deploy from GitHub repo"
3. Connecter GitHub
4. Sélectionner repo backend
5. Configurer variables d'env
6. Railway détecte automatiquement Node.js
7. Deploy automatique !

**Via Heroku (Sans CLI) :**

1. heroku.com
2. "New" > "Create new app"
3. Connect GitHub
4. Enable automatic deploys
5. Configurer variables d'env
6. Deploy branch

---

## 8. CHECKLIST COMPLÈTE

### 8.1 Fichiers à Générer - Mobile (45 fichiers)

**Configuration (6 fichiers)**
- [ ] package.json
- [ ] tsconfig.json
- [ ] babel.config.js
- [ ] metro.config.js
- [ ] .env.example
- [ ] app.json

**Theme & Constants (5 fichiers)**
- [ ] src/theme/theme.ts
- [ ] src/theme/typography.ts
- [ ] src/constants/colors.ts
- [ ] src/constants/dimensions.ts
- [ ] src/constants/config.ts

**Store (5 fichiers)**
- [ ] src/store/index.ts
- [ ] src/store/slices/authSlice.ts
- [ ] src/store/slices/appSlice.ts
- [ ] src/store/slices/userSlice.ts
- [ ] src/store/hooks.ts

**API (6 fichiers)**
- [ ] src/api/axios.config.ts
- [ ] src/api/endpoints.ts
- [ ] src/api/services/auth.service.ts
- [ ] src/api/services/user.service.ts
- [ ] src/api/services/match.service.ts
- [ ] src/api/services/booking.service.ts

**Navigation (4 fichiers)**
- [ ] src/navigation/types.ts
- [ ] src/navigation/RootNavigator.tsx
- [ ] src/navigation/AuthNavigator.tsx
- [ ] src/navigation/MainNavigator.tsx

**Composants Communs (6 fichiers)**
- [ ] src/components/common/Button.tsx
- [ ] src/components/common/Input.tsx
- [ ] src/components/common/Card.tsx
- [ ] src/components/common/Avatar.tsx
- [ ] src/components/common/Loading.tsx
- [ ] src/components/common/ErrorMessage.tsx

**Composants Features (6 fichiers)**
- [ ] src/components/features/PlayerCard.tsx
- [ ] src/components/features/MatchCard.tsx
- [ ] src/components/features/CourtCard.tsx
- [ ] src/components/features/StatCard.tsx
- [ ] src/components/features/SearchFilters.tsx
- [ ] src/components/features/ChatBubble.tsx

**Screens Auth (3 fichiers)**
- [ ] src/screens/auth/LoginScreen.tsx
- [ ] src/screens/auth/SignUpScreen.tsx
- [ ] src/screens/auth/OnboardingScreen.tsx

**Screens Main (4+ fichiers)**
- [ ] src/screens/home/HomeScreen.tsx
- [ ] src/screens/search/SearchPlayersScreen.tsx
- [ ] src/screens/booking/BookingScreen.tsx
- [ ] src/screens/matches/MatchesScreen.tsx
- [ ] ...

### 8.2 Fichiers à Générer - Backend (30 fichiers)

**Configuration (4 fichiers)**
- [ ] package.json
- [ ] tsconfig.json
- [ ] .env.example
- [ ] prisma/schema.prisma

**Core (3 fichiers)**
- [ ] src/index.ts
- [ ] src/config/database.ts
- [ ] src/config/redis.ts

**Middleware (4 fichiers)**
- [ ] src/middleware/auth.middleware.ts
- [ ] src/middleware/validate.middleware.ts
- [ ] src/middleware/error.middleware.ts
- [ ] src/middleware/rateLimit.middleware.ts

**Services (8 fichiers)**
- [ ] src/services/auth.service.ts
- [ ] src/services/user.service.ts
- [ ] src/services/match.service.ts
- [ ] src/services/booking.service.ts
- [ ] src/services/payment.service.ts
- [ ] src/services/notification.service.ts
- [ ] src/services/email.service.ts
- [ ] src/services/search.service.ts

**Controllers (6 fichiers)**
- [ ] src/controllers/auth.controller.ts
- [ ] src/controllers/user.controller.ts
- [ ] src/controllers/match.controller.ts
- [ ] src/controllers/booking.controller.ts
- [ ] src/controllers/subscription.controller.ts
- [ ] src/controllers/notification.controller.ts

**Routes (6 fichiers)**
- [ ] src/routes/index.ts
- [ ] src/routes/auth.routes.ts
- [ ] src/routes/user.routes.ts
- [ ] src/routes/match.routes.ts
- [ ] src/routes/booking.routes.ts
- [ ] src/routes/subscription.routes.ts

---

## 9. TEMPLATES DE PROMPTS PAR FONCTIONNALITÉ

### Authentification Complète

```
Génère le système d'authentification complet :

BACKEND :
- Routes : POST /register, /login, /refresh, /logout
- Google OAuth, Apple Sign-In
- JWT tokens (access + refresh)
- Password hashing bcrypt
- Email verification

MOBILE :
- LoginScreen avec social login buttons
- SignUpScreen avec validation
- ForgotPasswordScreen
- authSlice Redux
- auth.service.ts avec React Query

Code TypeScript complet pour tous les fichiers.
```

### Réservation de Terrains

```
Génère le module de réservation complet :

BACKEND :
- Modèle Booking dans Prisma (si pas déjà fait)
- Routes CRUD bookings
- Vérification disponibilité
- Intégration Stripe payment
- Notifications confirmation

MOBILE :
- SearchCourtsScreen (carte + liste)
- CourtDetailsScreen
- DateTimePickerScreen (calendrier)
- BookingSummaryScreen
- PaymentScreen (Stripe)
- BookingConfirmationScreen

Flux complet de A à Z avec navigation.
```

### Système de Matching

```
Génère l'algorithme de matching de joueurs :

BACKEND :
- Service matching.service.ts
- Algorithme basé sur :
  * Niveau de jeu (± 1 niveau)
  * Distance géographique (< 10km)
  * Disponibilités communes
  * Historique de jeux ensemble
  * Évaluations mutuelles
- Scoring et tri
- Cache Redis des résultats

MOBILE :
- Hook useMatchingAlgorithm
- Affichage score de compatibilité
- UI pour voir les critères de matching

Avec TypeScript et commentaires algorithme.
```

---

## 10. FAQ - Questions Fréquentes

**Q : Combien de temps pour générer tout le code ?**
R : 2-3 heures de conversation avec Claude pour générer tous les fichiers essentiels du MVP.

**Q : Le code généré est-il prêt à l'emploi ?**
R : Oui, mais nécessite assemblage et tests. Le code est fonctionnel mais peut nécessiter des ajustements mineurs.

**Q : Puis-je générer le code en plusieurs sessions ?**
R : Oui ! Sauvegardez les fichiers au fur et à mesure. Vous pouvez revenir et continuer.

**Q : Claude peut-il modifier un fichier déjà généré ?**
R : Oui, fournissez le fichier et demandez les modifications spécifiques.

**Q : Dois-je tout générer ou puis-je utiliser des templates ?**
R : Mixte recommandé : Utilisez `npx react-native init` pour le squelette, puis remplacez les fichiers par les versions générées.

**Q : Comment gérer les fichiers trop longs ?**
R : Demandez à Claude de générer par sections ou de splitter en plusieurs fichiers plus petits.

**Q : Le code est-il optimisé ?**
R : Oui, Claude applique les best practices, mais vous pouvez demander des optimisations spécifiques après.

**Q : Puis-je générer des tests aussi ?**
R : Absolument ! Demandez "Génère les tests Jest pour [composant]".

---

## 11. COMMANDES RAPIDES À COPIER-COLLER

**Démarrage Session :**
```
Je veux générer l'application Paddle. Commençons par le mobile.
Étape 1 : Génère package.json avec React Native 0.74, TypeScript,
et toutes les dépendances du document technique.
```

**Génération Batch Screens :**
```
Génère les 5 écrans suivants avec code complet TypeScript :
1. HomeScreen.tsx (dashboard)
2. SearchPlayersScreen.tsx (recherche avec filtres)
3. MatchDetailsScreen.tsx (détails d'un match)
4. ProfileScreen.tsx (profil utilisateur)
5. SettingsScreen.tsx (paramètres)

Tous avec navigation, React Query, loading/error states.
```

**Backend Complet :**
```
Génère le backend complet en une fois :
1. Prisma schema avec tous les modèles
2. Express server setup
3. Auth routes + JWT
4. User routes CRUD
5. Match routes CRUD
6. Booking routes CRUD
7. Middleware (auth, error, validation)

Structure optimale, TypeScript, commentaires en français.
```

**Corrections Rapides :**
```
Corrige les erreurs TypeScript dans ce fichier :
[coller le code]

Et améliore la gestion d'erreurs.
```

---

## 12. PROCHAINES ÉTAPES

**Maintenant que vous avez ce guide :**

1. **Démarrez la génération** avec le premier prompt de configuration
2. **Téléchargez chaque fichier** au fur et à mesure
3. **Organisez-les** dans la structure de dossiers
4. **Testez localement** ou dans Codespaces
5. **Itérez** avec Claude pour les corrections

**Êtes-vous prêt à commencer ?**

Dites-moi simplement : **"Commençons la génération"** et je vais créer le premier fichier !

---

**Document créé par :** Claude  
**Version :** 1.0  
**Date :** 16 Novembre 2025  
**Contact :** Cette conversation 😊
