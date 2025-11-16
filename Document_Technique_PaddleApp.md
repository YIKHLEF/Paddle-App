# DOCUMENT TECHNIQUE
## Application Mobile Paddle - Architecture & Développement avec Claude Code

**Version:** 1.0  
**Date:** 16 Novembre 2025  
**Stack Technologique:** React Native (Cross-Platform iOS/Android)

---

## 1. ARCHITECTURE TECHNIQUE

### 1.1 Vue d'Ensemble

L'application sera développée en **React Native** avec **TypeScript** pour assurer:
- Code unique pour iOS et Android (réduction des coûts de 50%)
- Performance native via New Architecture (JSI, Fabric)
- Écosystème riche de bibliothèques
- Développement rapide et itératif
- Facilité de maintenance

**Architecture:** Clean Architecture avec séparation des responsabilités

```
┌─────────────────────────────────────────────────┐
│              MOBILE APP (React Native)          │
│  ┌───────────┐  ┌──────────┐  ┌─────────────┐ │
│  │    UI     │  │  State   │  │  Navigation │ │
│  │ Components│◄─┤Management│◄─┤   Routing   │ │
│  └───────────┘  └──────────┘  └─────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │        Business Logic Layer                │ │
│  │  (Services, Hooks, Utils)                  │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │          Data Layer                        │ │
│  │  (API Client, Local Storage, Cache)       │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                      ▲ │
                      │ │ REST API / GraphQL
                      │ ▼
┌─────────────────────────────────────────────────┐
│              BACKEND (Node.js)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │   API    │  │Business  │  │ Database     │ │
│  │ Gateway  │─►│  Logic   │─►│ PostgreSQL   │ │
│  └──────────┘  └──────────┘  └──────────────┘ │
│  ┌──────────────────────────────────────────┐  │
│  │    External Services Integration          │  │
│  │ (Payment, Push, Storage, Analytics)       │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 2. STACK TECHNOLOGIQUE DÉTAILLÉE

### 2.1 Frontend (Mobile App)

#### Core Framework
```json
{
  "react-native": "0.74.x",
  "typescript": "^5.3.0",
  "react": "18.2.0"
}
```

#### Navigation
```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "@react-navigation/native-stack": "^6.9.17",
  "@react-navigation/drawer": "^6.6.6"
}
```

**Justification:** React Navigation est la solution standard, performante et bien maintenue pour la navigation React Native.

#### State Management
```json
{
  "@reduxjs/toolkit": "^2.0.1",
  "react-redux": "^9.0.4",
  "redux-persist": "^6.0.0",
  "@tanstack/react-query": "^5.17.0"
}
```

**Justification:** 
- Redux Toolkit pour le state global (user, auth, app settings)
- React Query pour le state serveur (cache, sync, optimistic updates)
- Redux Persist pour la persistance

#### UI Components & Styling
```json
{
  "react-native-paper": "^5.11.3",
  "react-native-vector-icons": "^10.0.3",
  "@shopify/flash-list": "^1.6.3",
  "react-native-reanimated": "^3.6.1",
  "react-native-gesture-handler": "^2.14.1",
  "styled-components": "^6.1.8"
}
```

**Justification:**
- React Native Paper: Material Design components prêts à l'emploi
- Flash-list: Performance optimale pour les listes longues
- Reanimated 3: Animations fluides 60 FPS sur thread natif
- Styled-components: CSS-in-JS avec TypeScript support

#### Formulaires & Validation
```json
{
  "react-hook-form": "^7.49.2",
  "zod": "^3.22.4",
  "@hookform/resolvers": "^3.3.3"
}
```

**Justification:** React Hook Form (performance) + Zod (validation TypeScript-first)

#### Fonctionnalités Natives

**Géolocalisation:**
```json
{
  "react-native-maps": "^1.10.0",
  "@react-native-community/geolocation": "^3.1.0"
}
```

**Caméra & Images:**
```json
{
  "react-native-image-picker": "^7.1.0",
  "react-native-vision-camera": "^3.8.0",
  "react-native-fast-image": "^8.6.3"
}
```

**Notifications Push:**
```json
{
  "@react-native-firebase/app": "^19.0.0",
  "@react-native-firebase/messaging": "^19.0.0",
  "@notifee/react-native": "^7.8.2"
}
```

**Justification:** Firebase Cloud Messaging (standard industrie) + Notifee (notifications locales avancées)

**Paiements In-App:**
```json
{
  "react-native-iap": "^12.13.0"
}
```

**Justification:** Library unifiée pour iOS (StoreKit 2) et Android (Google Play Billing 6)

**Authentification:**
```json
{
  "@react-native-google-signin/google-signin": "^11.0.0",
  "@invertase/react-native-apple-authentication": "^2.3.0",
  "react-native-fbsdk-next": "^12.1.2"
}
```

**Stockage Local:**
```json
{
  "@react-native-async-storage/async-storage": "^1.21.0",
  "react-native-mmkv": "^2.11.0"
}
```

**Justification:** MMKV pour les données fréquemment accédées (ultra-rapide), AsyncStorage pour le reste

**Biométrie:**
```json
{
  "react-native-biometrics": "^3.0.1"
}
```

**Date & Time:**
```json
{
  "date-fns": "^3.0.6",
  "react-native-date-picker": "^4.3.3"
}
```

#### Network & API
```json
{
  "axios": "^1.6.2",
  "socket.io-client": "^4.6.1"
}
```

**Justification:** Axios pour REST API + Socket.io pour chat en temps réel

#### Analytics & Monitoring
```json
{
  "@react-native-firebase/analytics": "^19.0.0",
  "@sentry/react-native": "^5.15.2"
}
```

**Justification:** Firebase Analytics (gratuit, complet) + Sentry (error tracking, performance monitoring)

#### Testing
```json
{
  "@testing-library/react-native": "^12.4.2",
  "jest": "^29.7.0",
  "detox": "^20.16.0"
}
```

### 2.2 Backend

#### Runtime & Framework
```json
{
  "node": "20.x LTS",
  "typescript": "^5.3.0",
  "express": "^4.18.2",
  "fastify": "^4.25.0"
}
```

**Alternative recommandée: Fastify** (plus performant qu'Express)

#### API Architecture
```typescript
// Option 1: REST API
{
  "express": "^4.18.2",
  "express-validator": "^7.0.1",
  "helmet": "^7.1.0",
  "cors": "^2.8.5"
}

// Option 2: GraphQL (recommandé pour flexibilité)
{
  "apollo-server-express": "^3.13.0",
  "@graphql-tools/schema": "^10.0.2",
  "graphql": "^16.8.1"
}
```

**Recommandation:** GraphQL pour éviter l'over-fetching et offrir une API flexible

#### Base de Données
```json
{
  "postgresql": "16.x",
  "prisma": "^5.7.1",
  "@prisma/client": "^5.7.1"
}
```

**Justification:** 
- PostgreSQL: robuste, open-source, JSON support, excellent pour relations complexes
- Prisma: ORM moderne TypeScript-first, migrations faciles, excellent DX

**Alternative Redis:**
```json
{
  "redis": "^4.6.12",
  "ioredis": "^5.3.2"
}
```
Pour cache, sessions, queues

#### Authentification & Sécurité
```json
{
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "passport-apple": "^2.0.2"
}
```

#### Paiements
```json
{
  "stripe": "^14.9.0"
}
```

**Justification:** Stripe Billing pour gérer abonnements (webhooks, dunning, analytics)

#### Storage (Fichiers)
```json
{
  "@aws-sdk/client-s3": "^3.478.0"
}
```

**Alternatives:** Cloudflare R2, DigitalOcean Spaces (compatibles S3)

#### Notifications
```json
{
  "firebase-admin": "^12.0.0",
  "node-apn": "^3.0.0"
}
```

#### Real-time
```json
{
  "socket.io": "^4.6.1"
}
```

#### Background Jobs
```json
{
  "bullmq": "^5.1.4"
}
```

**Justification:** Queue robuste avec Redis, pour emails, notifications, processus lourds

#### Monitoring & Logs
```json
{
  "winston": "^3.11.0",
  "@sentry/node": "^7.91.0",
  "prom-client": "^15.1.0"
}
```

---

## 3. STRUCTURE DU PROJET

### 3.1 Structure React Native App

```
paddle-app/
├── src/
│   ├── api/                      # API clients et configurations
│   │   ├── axios.config.ts
│   │   ├── endpoints.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── user.service.ts
│   │       ├── booking.service.ts
│   │       ├── match.service.ts
│   │       └── ...
│   │
│   ├── assets/                   # Images, fonts, animations
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── lottie/
│   │
│   ├── components/               # Composants réutilisables
│   │   ├── common/              # Boutons, inputs, cards...
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Avatar.tsx
│   │   ├── features/            # Composants métier
│   │   │   ├── PlayerCard.tsx
│   │   │   ├── MatchCard.tsx
│   │   │   ├── CourtCard.tsx
│   │   │   └── StatisticsChart.tsx
│   │   └── layouts/             # Layouts
│   │       ├── Screen.tsx
│   │       └── Container.tsx
│   │
│   ├── navigation/              # Configuration navigation
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   ├── BottomTabNavigator.tsx
│   │   └── types.ts
│   │
│   ├── screens/                 # Écrans de l'app
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignUpScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── search/
│   │   │   ├── SearchPlayersScreen.tsx
│   │   │   └── SearchCourtsScreen.tsx
│   │   ├── booking/
│   │   │   ├── BookingScreen.tsx
│   │   │   └── BookingConfirmationScreen.tsx
│   │   ├── matches/
│   │   │   ├── MatchesScreen.tsx
│   │   │   ├── MatchDetailsScreen.tsx
│   │   │   └── CreateMatchScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   └── StatisticsScreen.tsx
│   │   └── subscription/
│   │       └── SubscriptionScreen.tsx
│   │
│   ├── store/                   # Redux store
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   ├── appSlice.ts
│   │   │   └── ...
│   │   └── hooks.ts            # useAppSelector, useAppDispatch
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useLocation.ts
│   │   ├── useTheme.ts
│   │   ├── useSubscription.ts
│   │   └── ...
│   │
│   ├── utils/                   # Fonctions utilitaires
│   │   ├── date.utils.ts
│   │   ├── validation.utils.ts
│   │   ├── formatting.utils.ts
│   │   └── storage.utils.ts
│   │
│   ├── constants/               # Constantes
│   │   ├── colors.ts
│   │   ├── dimensions.ts
│   │   ├── config.ts
│   │   └── api.constants.ts
│   │
│   ├── theme/                   # Theme & styles
│   │   ├── theme.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── models.ts
│   │   ├── api.types.ts
│   │   └── navigation.types.ts
│   │
│   └── App.tsx                  # Point d'entrée
│
├── android/                     # Code natif Android
├── ios/                        # Code natif iOS
├── __tests__/                  # Tests
├── .env                        # Variables d'environnement
├── package.json
├── tsconfig.json
└── babel.config.js
```

### 3.2 Structure Backend (Node.js)

```
paddle-api/
├── src/
│   ├── config/                  # Configuration
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── firebase.ts
│   │   └── stripe.ts
│   │
│   ├── controllers/             # Logique des routes
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── match.controller.ts
│   │   └── subscription.controller.ts
│   │
│   ├── services/                # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── booking.service.ts
│   │   ├── payment.service.ts
│   │   ├── notification.service.ts
│   │   └── matching.service.ts
│   │
│   ├── models/                  # Modèles Prisma (généré)
│   │
│   ├── routes/                  # Définition des routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── booking.routes.ts
│   │   └── index.ts
│   │
│   ├── middleware/              # Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│   │
│   ├── utils/                   # Utilitaires
│   │   ├── jwt.utils.ts
│   │   ├── email.utils.ts
│   │   └── validation.utils.ts
│   │
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   │
│   ├── jobs/                    # Background jobs
│   │   ├── email.job.ts
│   │   └── notifications.job.ts
│   │
│   └── index.ts                 # Point d'entrée
│
├── prisma/
│   ├── schema.prisma            # Schéma de base de données
│   ├── migrations/
│   └── seed.ts
│
├── tests/
├── .env
├── package.json
└── tsconfig.json
```

---

## 4. MODÈLE DE DONNÉES (PRISMA SCHEMA)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USERS ====================

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  phoneNumber       String?   @unique
  passwordHash      String?
  
  // Profile
  firstName         String
  lastName          String
  username          String    @unique
  bio               String?   @db.VarChar(200)
  avatarUrl         String?
  dateOfBirth       DateTime
  gender            Gender
  
  // Paddle specific
  skillLevel        SkillLevel
  preferredPosition Position
  dominantHand      DominantHand
  location          String
  latitude          Float?
  longitude         Float?
  
  // Subscription
  subscriptionTier  SubscriptionTier @default(FREE)
  subscriptionId    String?
  subscriptionStart DateTime?
  subscriptionEnd   DateTime?
  trialUsed         Boolean          @default(false)
  
  // Social auth
  googleId          String?   @unique
  appleId           String?   @unique
  facebookId        String?   @unique
  
  // Metadata
  isVerified        Boolean   @default(false)
  isActive          Boolean   @default(true)
  lastActiveAt      DateTime  @default(now())
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  organizedMatches  Match[]   @relation("MatchOrganizer")
  participations    MatchParticipant[]
  sentMessages      Message[] @relation("MessageSender")
  receivedMessages  Message[] @relation("MessageReceiver")
  bookings          Booking[]
  reviews           Review[]  @relation("ReviewAuthor")
  receivedReviews   Review[]  @relation("ReviewTarget")
  statistics        UserStatistics?
  notifications     Notification[]
  payments          Payment[]
  clubs             ClubMembership[]
  
  @@map("users")
}

model UserStatistics {
  id                String   @id @default(uuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  totalMatches      Int      @default(0)
  matchesWon        Int      @default(0)
  matchesLost       Int      @default(0)
  winRate           Float    @default(0)
  currentStreak     Int      @default(0)
  longestWinStreak  Int      @default(0)
  totalPlayTime     Int      @default(0) // minutes
  ranking           Int?
  eloScore          Int      @default(1000)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@map("user_statistics")
}

// ==================== MATCHES ====================

model Match {
  id                String    @id @default(uuid())
  
  // Match details
  type              MatchType
  format            MatchFormat
  status            MatchStatus @default(SCHEDULED)
  visibility        Visibility  @default(PUBLIC)
  
  organizerId       String
  organizer         User      @relation("MatchOrganizer", fields: [organizerId], references: [id])
  
  courtId           String?
  court             Court?    @relation(fields: [courtId], references: [id])
  
  // Timing
  scheduledAt       DateTime
  startedAt         DateTime?
  endedAt           DateTime?
  duration          Int?      // minutes
  
  // Requirements
  requiredLevel     SkillLevel?
  maxParticipants   Int       @default(4)
  
  // Metadata
  description       String?
  isRecurring       Boolean   @default(false)
  recurrenceRule    String?   // iCal RRULE format
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  participants      MatchParticipant[]
  scores            MatchScore[]
  chatMessages      ChatMessage[]
  
  @@map("matches")
}

model MatchParticipant {
  id                String   @id @default(uuid())
  
  matchId           String
  match             Match    @relation(fields: [matchId], references: [id], onDelete: Cascade)
  
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  
  status            ParticipantStatus @default(PENDING)
  team              Int?     // 1 or 2 for team matches
  checkedInAt       DateTime?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([matchId, userId])
  @@map("match_participants")
}

model MatchScore {
  id                String   @id @default(uuid())
  
  matchId           String
  match             Match    @relation(fields: [matchId], references: [id], onDelete: Cascade)
  
  team1Score        Int
  team2Score        Int
  setNumber         Int
  
  createdAt         DateTime @default(now())
  
  @@map("match_scores")
}

// ==================== COURTS & CLUBS ====================

model Club {
  id                String   @id @default(uuid())
  
  name              String
  description       String?
  address           String
  city              String
  postalCode        String
  country           String
  latitude          Float
  longitude         Float
  
  phoneNumber       String?
  email             String?
  website           String?
  
  // Features
  facilities        String[] // ["parking", "bar", "shop", "showers"]
  openingHours      Json     // {"monday": {"open": "08:00", "close": "22:00"}}
  
  // Media
  logoUrl           String?
  photos            String[]
  
  // Metadata
  isPartner         Boolean  @default(false)
  averageRating     Float?
  totalReviews      Int      @default(0)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  courts            Court[]
  memberships       ClubMembership[]
  
  @@map("clubs")
}

model Court {
  id                String   @id @default(uuid())
  
  clubId            String
  club              Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)
  
  name              String
  courtNumber       Int
  type              CourtType // INDOOR, OUTDOOR
  surface           String    // "grass", "cement", "artificial turf"
  
  // Availability
  isActive          Boolean  @default(true)
  
  // Pricing
  pricePerHour      Float
  currency          String   @default("EUR")
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  bookings          Booking[]
  matches           Match[]
  
  @@map("courts")
}

model ClubMembership {
  id                String   @id @default(uuid())
  
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  
  clubId            String
  club              Club     @relation(fields: [clubId], references: [id])
  
  membershipType    String   // "member", "premium", etc.
  startDate         DateTime
  endDate           DateTime?
  
  createdAt         DateTime @default(now())
  
  @@unique([userId, clubId])
  @@map("club_memberships")
}

// ==================== BOOKINGS ====================

model Booking {
  id                String   @id @default(uuid())
  
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  
  courtId           String
  court             Court    @relation(fields: [courtId], references: [id])
  
  // Timing
  startTime         DateTime
  endTime           DateTime
  duration          Int      // minutes
  
  // Status & Payment
  status            BookingStatus @default(PENDING)
  totalPrice        Float
  currency          String   @default("EUR")
  paymentMethod     PaymentMethod?
  paidAt            DateTime?
  
  // Metadata
  notes             String?
  cancellationReason String?
  cancelledAt       DateTime?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@map("bookings")
}

// ==================== MESSAGING ====================

model Conversation {
  id                String   @id @default(uuid())
  
  type              ConversationType @default(DIRECT)
  name              String?
  avatarUrl         String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  messages          Message[]
  participants      ConversationParticipant[]
  
  @@map("conversations")
}

model ConversationParticipant {
  id                String   @id @default(uuid())
  
  conversationId    String
  conversation      Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  userId            String
  
  lastReadAt        DateTime?
  mutedUntil        DateTime?
  
  createdAt         DateTime @default(now())
  
  @@unique([conversationId, userId])
  @@map("conversation_participants")
}

model Message {
  id                String   @id @default(uuid())
  
  conversationId    String
  conversation      Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  senderId          String
  sender            User     @relation("MessageSender", fields: [senderId], references: [id])
  
  recipientId       String?
  recipient         User?    @relation("MessageReceiver", fields: [recipientId], references: [id])
  
  type              MessageType @default(TEXT)
  content           String
  attachmentUrl     String?
  
  isRead            Boolean  @default(false)
  readAt            DateTime?
  
  createdAt         DateTime @default(now())
  
  @@map("messages")
}

model ChatMessage {
  id                String   @id @default(uuid())
  
  matchId           String
  match             Match    @relation(fields: [matchId], references: [id], onDelete: Cascade)
  
  userId            String
  content           String
  
  createdAt         DateTime @default(now())
  
  @@map("chat_messages")
}

// ==================== REVIEWS & RATINGS ====================

model Review {
  id                String   @id @default(uuid())
  
  authorId          String
  author            User     @relation("ReviewAuthor", fields: [authorId], references: [id])
  
  targetId          String
  target            User     @relation("ReviewTarget", fields: [targetId], references: [id])
  
  // Ratings (1-5)
  punctualityRating Int
  fairPlayRating    Int
  skillRating       Int
  friendlinessRating Int
  overallRating     Float
  
  comment           String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([authorId, targetId])
  @@map("reviews")
}

// ==================== SUBSCRIPTIONS & PAYMENTS ====================

model Payment {
  id                String   @id @default(uuid())
  
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  
  amount            Float
  currency          String   @default("EUR")
  status            PaymentStatus
  
  type              String   // "subscription", "booking", "tournament"
  provider          String   // "stripe", "apple", "google"
  providerPaymentId String?
  
  metadata          Json?
  
  createdAt         DateTime @default(now())
  
  @@map("payments")
}

// ==================== NOTIFICATIONS ====================

model Notification {
  id                String   @id @default(uuid())
  
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type              NotificationType
  title             String
  body              String
  data              Json?
  
  isRead            Boolean  @default(false)
  readAt            DateTime?
  
  createdAt         DateTime @default(now())
  
  @@map("notifications")
}

// ==================== ENUMS ====================

enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

enum SkillLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
  PRO
}

enum Position {
  LEFT
  RIGHT
  BOTH
}

enum DominantHand {
  RIGHT
  LEFT
}

enum SubscriptionTier {
  FREE
  STANDARD
  PREMIUM
}

enum MatchType {
  FRIENDLY
  RANKED
  TRAINING
  TOURNAMENT
  DISCOVERY
}

enum MatchFormat {
  SINGLES
  DOUBLES
}

enum MatchStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum Visibility {
  PUBLIC
  PRIVATE
  FRIENDS_ONLY
}

enum ParticipantStatus {
  PENDING
  ACCEPTED
  DECLINED
  CHECKED_IN
}

enum CourtType {
  INDOOR
  OUTDOOR
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum PaymentMethod {
  CARD
  CASH
  ON_SITE
  SUBSCRIPTION
}

enum ConversationType {
  DIRECT
  GROUP
}

enum MessageType {
  TEXT
  IMAGE
  VIDEO
  LOCATION
  MATCH_INVITATION
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum NotificationType {
  MATCH_INVITATION
  MATCH_REMINDER
  BOOKING_CONFIRMATION
  MESSAGE
  REVIEW_REQUEST
  SUBSCRIPTION_RENEWAL
  ACHIEVEMENT
  GENERAL
}
```

---

## 5. API ENDPOINTS PRINCIPAUX

### 5.1 Authentication

```typescript
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/login/google
POST   /api/auth/login/apple
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/verify-email/:token
```

### 5.2 Users

```typescript
GET    /api/users/me
PUT    /api/users/me
DELETE /api/users/me
GET    /api/users/:id
GET    /api/users/search                    // Query params: level, location, radius
GET    /api/users/:id/statistics
GET    /api/users/:id/matches
GET    /api/users/:id/reviews
POST   /api/users/:id/reviews
```

### 5.3 Matches

```typescript
GET    /api/matches                         // List all (with filters)
POST   /api/matches                         // Create match
GET    /api/matches/:id
PUT    /api/matches/:id
DELETE /api/matches/:id
POST   /api/matches/:id/join
POST   /api/matches/:id/leave
PUT    /api/matches/:id/checkin
POST   /api/matches/:id/score               // Submit score
GET    /api/matches/:id/participants
POST   /api/matches/:id/invite              // Invite user
```

### 5.4 Courts & Clubs

```typescript
GET    /api/clubs                           // List with filters
GET    /api/clubs/:id
GET    /api/clubs/:id/courts
GET    /api/courts/:id
GET    /api/courts/:id/availability         // Query: date
```

### 5.5 Bookings

```typescript
GET    /api/bookings                        // My bookings
POST   /api/bookings                        // Create booking
GET    /api/bookings/:id
PUT    /api/bookings/:id                    // Modify
DELETE /api/bookings/:id                    // Cancel
```

### 5.6 Messaging

```typescript
GET    /api/conversations
POST   /api/conversations                   // Create conversation
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
PUT    /api/conversations/:id/read          // Mark as read
```

### 5.7 Subscriptions

```typescript
GET    /api/subscriptions/plans
POST   /api/subscriptions/subscribe
POST   /api/subscriptions/cancel
GET    /api/subscriptions/status
POST   /api/subscriptions/webhooks/stripe   // Webhook
POST   /api/subscriptions/webhooks/apple    // Webhook
POST   /api/subscriptions/webhooks/google   // Webhook
```

### 5.8 Notifications

```typescript
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
POST   /api/notifications/register-device   // FCM token
```

---

## 6. DÉVELOPPEMENT AVEC CLAUDE CODE

### 6.1 Setup Initial

**Commandes pour démarrer le projet:**

```bash
# Installation de Claude Code (si pas déjà fait)
npm install -g @anthropic-ai/claude-code

# Initialisation du projet React Native
npx react-native@latest init PaddleApp --template react-native-template-typescript
cd PaddleApp

# Installation des dépendances principales
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @reduxjs/toolkit react-redux redux-persist
npm install @tanstack/react-query
npm install react-native-paper react-native-vector-icons
npm install react-hook-form zod @hookform/resolvers
npm install axios socket.io-client
npm install @react-native-firebase/app @react-native-firebase/messaging
npm install react-native-iap
npm install date-fns
npm install @react-native-async-storage/async-storage react-native-mmkv

# Dev dependencies
npm install -D @types/react @types/react-native
```

**Commandes Backend:**

```bash
# Initialisation backend
mkdir paddle-api && cd paddle-api
npm init -y
npm install express fastify typescript ts-node
npm install prisma @prisma/client
npm install jsonwebtoken bcryptjs passport
npm install stripe firebase-admin socket.io
npm install bullmq ioredis
npm install winston @sentry/node

# Dev dependencies
npm install -D @types/node @types/express @types/jsonwebtoken
npm install -D tsx nodemon

# Initialiser Prisma
npx prisma init
```

### 6.2 Utilisation de Claude Code

**Prompts efficaces pour Claude Code:**

#### Génération de Composants

```bash
claude code "Crée un composant PlayerCard réutilisable en React Native avec TypeScript.
Il doit afficher:
- Avatar (avec fallback)
- Nom complet et username
- Niveau de jeu avec badge coloré
- Rating (étoiles)
- Bouton 'Inviter'
Utilise react-native-paper pour le style et respecte le design system (couleurs: #0066FF primaire, spacing 8pt)"
```

#### Génération d'Écrans

```bash
claude code "Génère l'écran SearchPlayersScreen en React Native avec:
- Barre de recherche
- Filtres (niveau, distance, disponibilité)
- Liste de PlayerCard avec FlashList
- Pull to refresh
- États: loading, error, empty
Intègre React Query pour le fetching et Redux pour les filtres.
Utilise TypeScript strict."
```

#### Génération de Services API

```bash
claude code "Crée le service auth.service.ts pour l'API backend avec:
- register(email, password, userData)
- login(email, password)
- loginWithGoogle(googleToken)
- loginWithApple(appleToken)
- refreshToken(refreshToken)
Utilise Prisma, bcryptjs pour hash, JWT pour tokens.
Inclus gestion d'erreurs et validation avec Zod."
```

#### Génération de Routes API

```bash
claude code "Génère les routes REST pour les matchs avec Express:
GET /matches (avec filtres: status, level, date)
POST /matches (create)
GET /matches/:id
PUT /matches/:id
DELETE /matches/:id
POST /matches/:id/join
Inclus middleware d'auth, validation, et gestion d'erreurs.
Utilise Prisma pour la DB."
```

#### Génération de Schémas Prisma

```bash
claude code "Ajoute au schéma Prisma un modèle Tournament avec:
- Relations avec User (organizer), Court, MatchParticipant
- Champs: name, description, startDate, endDate, maxParticipants, entryFee, prize
- Status enum (UPCOMING, ONGOING, COMPLETED, CANCELLED)
- Inclus timestamps et relations appropriées"
```

#### Tests

```bash
claude code "Génère des tests Jest pour le composant PlayerCard:
- Test de rendu avec props valides
- Test du bouton Inviter (onPress callback)
- Test du fallback avatar
- Test des différents niveaux (couleurs de badge)
Utilise @testing-library/react-native"
```

### 6.3 Workflow Recommandé avec Claude Code

**Phase 1: Setup & Architecture (Semaine 1)**

1. Générer la structure de base des dossiers
2. Configurer navigation (RootNavigator, AuthNavigator, MainNavigator)
3. Setup Redux store avec slices basiques
4. Configurer API client (Axios avec interceptors)
5. Setup theme et design system
6. Créer composants de base (Button, Input, Card)

**Phase 2: Authentification (Semaine 2)**

1. Backend: routes auth + JWT + Prisma
2. Frontend: écrans Login, SignUp, Onboarding
3. Intégration Google/Apple Sign-In
4. Gestion du token et refresh
5. Protected routes

**Phase 3: Core Features (Semaines 3-6)**

1. Profil utilisateur (CRUD)
2. Recherche de joueurs avec filtres
3. Système de matching
4. Réservation de terrains
5. Création et gestion de matchs
6. Messagerie temps réel (Socket.io)
7. Système de notation/reviews

**Phase 4: Abonnements (Semaine 7)**

1. Intégration Stripe backend
2. Setup In-App Purchase (iOS & Android)
3. Écrans de pricing et checkout
4. Webhooks pour sync
5. Gestion du trial et renouvellement

**Phase 5: Fonctionnalités Avancées (Semaines 8-10)**

1. Statistiques et analytics
2. Notifications push
3. Système de classement
4. Fonctionnalités sociales
5. Optimisations performance

### 6.4 Prompts Avancés

**Génération de Flux Complets:**

```bash
claude code "Implémente le flux complet de réservation de terrain:

Backend (Express + Prisma):
1. Route POST /api/bookings avec validation Zod
2. Vérifier disponibilité du terrain
3. Créer booking + payment intent Stripe
4. Envoyer confirmation par email (nodemailer)
5. Notification push au club

Frontend (React Native):
1. Écran SelectCourt avec carte interactive
2. Écran SelectDateTime avec calendrier
3. Écran BookingSummary avec récap et paiement
4. Intégration Stripe (react-native-stripe-sdk)
5. Écran BookingConfirmation

Inclus gestion d'erreurs complète, loading states, et navigation entre écrans."
```

**Optimisations Performance:**

```bash
claude code "Optimise la performance de la liste de matchs:
- Remplace FlatList par FlashList
- Implémente virtualisation avec getItemType
- Ajoute memo sur MatchCard
- Implémente pagination infinie avec React Query
- Ajoute optimistic updates pour les actions (join/leave)
- Cache images avec react-native-fast-image"
```

---

## 7. INFRASTRUCTURE & DÉPLOIEMENT

### 7.1 Choix d'Infrastructure

**Backend Hosting:**

**Option 1: Railway (Recommandé pour MVP)**
- ✅ Setup ultra-rapide
- ✅ PostgreSQL inclus
- ✅ Auto-deploy depuis GitHub
- ✅ Prix: ~$20-50/mois
- ✅ Scaling facile

**Option 2: AWS (Pour scale)**
- Elastic Beanstalk ou ECS
- RDS PostgreSQL
- ElastiCache Redis
- S3 pour fichiers
- CloudFront CDN

**Option 3: DigitalOcean (Bon rapport qualité/prix)**
- App Platform
- Managed PostgreSQL
- Spaces (S3-compatible)

**Base de données:**
- PostgreSQL 16 (managed service recommandé)
- Redis (pour cache et queues)

**File Storage:**
- AWS S3 / Cloudflare R2 / DigitalOcean Spaces
- CDN pour optimiser delivery

**Monitoring:**
- Sentry (errors & performance)
- Datadog ou New Relic (APM)
- LogRocket pour session replay

### 7.2 CI/CD

**GitHub Actions pour React Native:**

```yaml
# .github/workflows/app-ci.yml
name: React Native CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      
  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: cd ios && pod install
      - run: npx react-native build-ios
      
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          distribution: 'zulu'
          java-version: '17'
      - run: npm ci
      - run: cd android && ./gradlew assembleRelease
```

**Déploiement automatique backend:**

```yaml
# .github/workflows/api-deploy.yml
name: Deploy API

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### 7.3 Configuration Environnement

**.env.example (Backend):**

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/paddle_db"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
APPLE_CLIENT_ID=""
APPLE_TEAM_ID=""
APPLE_KEY_ID=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Firebase
FIREBASE_PROJECT_ID=""
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_EMAIL=""

# AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_BUCKET_NAME=""
AWS_REGION="eu-west-1"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASSWORD=""

# App
NODE_ENV="development"
PORT=3000
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:8081"

# Monitoring
SENTRY_DSN=""
```

**.env.example (React Native):**

```bash
# API
API_BASE_URL="https://api.paddle-app.com"
SOCKET_URL="wss://api.paddle-app.com"

# Firebase
FIREBASE_API_KEY=""
FIREBASE_PROJECT_ID=""
FIREBASE_MESSAGING_SENDER_ID=""
FIREBASE_APP_ID=""

# Google Maps
GOOGLE_MAPS_API_KEY=""

# Stripe
STRIPE_PUBLISHABLE_KEY=""

# Sentry
SENTRY_DSN=""

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
```

---

## 8. SÉCURITÉ

### 8.1 Checklist Sécurité Backend

- ✅ HTTPS uniquement (TLS 1.3)
- ✅ Helmet.js pour headers sécurisés
- ✅ Rate limiting (express-rate-limit)
- ✅ CORS configuré strictement
- ✅ Input validation (Zod)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS prevention
- ✅ CSRF tokens
- ✅ Passwords hashed (bcryptjs, 12+ rounds)
- ✅ JWT avec expiration courte + refresh tokens
- ✅ Secrets dans variables d'environnement
- ✅ Logs sécurisés (pas de données sensibles)
- ✅ Dependencies à jour (npm audit)

### 8.2 Sécurité Mobile

- ✅ Certificat pinning
- ✅ Code obfuscation (ProGuard Android, Bitcode iOS)
- ✅ Secure storage pour tokens (Keychain iOS, Keystore Android)
- ✅ Biometric authentication
- ✅ Pas de secrets en dur dans le code
- ✅ Deep linking sécurisé
- ✅ WebView sécurisées si utilisées

### 8.3 RGPD Compliance

- ✅ Consentement explicite collecte données
- ✅ Politique de confidentialité claire
- ✅ Export de données (GDPR)
- ✅ Suppression de compte et données
- ✅ Opt-out analytics
- ✅ Chiffrement données sensibles at rest
- ✅ Logs d'accès aux données

---

## 9. TESTING

### 9.1 Tests Frontend

**Unit Tests (Jest + React Native Testing Library):**

```typescript
// __tests__/components/PlayerCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import PlayerCard from '@/components/PlayerCard';

describe('PlayerCard', () => {
  const mockPlayer = {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    level: 'INTERMEDIATE',
    rating: 4.5,
    avatarUrl: 'https://...'
  };

  it('renders player information correctly', () => {
    const { getByText } = render(<PlayerCard player={mockPlayer} />);
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('@johndoe')).toBeTruthy();
  });

  it('calls onInvite when button is pressed', () => {
    const mockOnInvite = jest.fn();
    const { getByText } = render(
      <PlayerCard player={mockPlayer} onInvite={mockOnInvite} />
    );
    fireEvent.press(getByText('Inviter'));
    expect(mockOnInvite).toHaveBeenCalledWith(mockPlayer.id);
  });
});
```

**Integration Tests (Detox):**

```typescript
// e2e/login.test.ts
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

### 9.2 Tests Backend

**Unit Tests:**

```typescript
// tests/services/auth.service.test.ts
import { AuthService } from '@/services/auth.service';
import { prismaMock } from '../mocks/prisma';

describe('AuthService', () => {
  describe('register', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      prismaMock.user.create.mockResolvedValue({
        id: '1',
        email: userData.email,
        ...userData
      });

      const result = await AuthService.register(userData);
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userData.email);
    });
  });
});
```

**API Tests (Supertest):**

```typescript
// tests/routes/auth.test.ts
import request from 'supertest';
import app from '@/index';

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: 'password123'
      });

    expect(response.status).toBe(400);
  });
});
```

---

## 10. PERFORMANCE & OPTIMISATION

### 10.1 Frontend Performance

**Optimisations React Native:**

```typescript
// Utiliser React.memo pour composants
export const PlayerCard = React.memo(({ player, onInvite }) => {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.player.id === nextProps.player.id;
});

// Utiliser useCallback pour callbacks
const handleInvite = useCallback((playerId: string) => {
  invitePlayer(playerId);
}, []);

// FlashList au lieu de FlatList
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={players}
  renderItem={({ item }) => <PlayerCard player={item} />}
  estimatedItemSize={100}
  getItemType={(item) => item.type}
/>

// Images optimisées
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: avatarUrl, priority: FastImage.priority.normal }}
  style={styles.avatar}
  resizeMode={FastImage.resizeMode.cover}
/>
```

**Bundle Size Optimization:**

```javascript
// babel.config.js - Activer Hermes
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
```

### 10.2 Backend Performance

**Database Optimization:**

```typescript
// Utiliser les index Prisma
model User {
  id       String @id @default(uuid())
  email    String @unique
  username String @unique
  location String
  
  @@index([location])
  @@index([skillLevel])
}

// Utiliser select pour éviter over-fetching
const users = await prisma.user.findMany({
  select: {
    id: true,
    username: true,
    avatarUrl: true,
    skillLevel: true,
  },
  where: { /* filters */ },
  take: 20,
});

// Pagination cursor-based
const users = await prisma.user.findMany({
  take: 20,
  skip: 1,
  cursor: {
    id: lastUserId,
  },
});
```

**Caching avec Redis:**

```typescript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Cache des résultats de recherche
async function searchPlayers(filters: SearchFilters) {
  const cacheKey = `search:${JSON.stringify(filters)}`;
  
  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Query DB
  const results = await prisma.user.findMany({ /* ... */ });
  
  // Store in cache (5 min TTL)
  await redis.setex(cacheKey, 300, JSON.stringify(results));
  
  return results;
}
```

---

## 11. MONITORING & ANALYTICS

### 11.1 Error Tracking (Sentry)

**Backend:**

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error handling middleware
app.use(Sentry.Handlers.errorHandler());
```

**Frontend:**

```typescript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: Config.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 11.2 Analytics (Firebase)

```typescript
import analytics from '@react-native-firebase/analytics';

// Track events
await analytics().logEvent('match_created', {
  match_id: matchId,
  match_type: 'FRIENDLY',
  participants: 4,
});

// Track screens
await analytics().logScreenView({
  screen_name: 'HomeScreen',
  screen_class: 'HomeScreen',
});

// Set user properties
await analytics().setUserProperties({
  subscription_tier: 'PREMIUM',
  skill_level: 'INTERMEDIATE',
});
```

### 11.3 KPIs Dashboard

**Metrics à tracker:**

- MAU / DAU
- Retention curves (D1, D7, D30)
- Conversion funnel (signup → trial → paid)
- Churn rate
- ARPU
- Feature usage
- API response times
- Error rates
- Crash-free rate

**Outils recommandés:**
- Mixpanel / Amplitude pour product analytics
- Firebase Analytics (gratuit)
- Custom dashboard (Grafana + Prometheus)

---

## 12. MAINTENANCE & ÉVOLUTION

### 12.1 Versioning

**Semantic Versioning:**
- v1.0.0 = MVP launch
- v1.1.0 = New features
- v1.1.1 = Bug fixes

**Release Notes dans les Stores:**
- Toujours communiquer les nouveautés
- Transparence sur les bug fixes
- Teaser des prochaines features

### 12.2 Stratégie de Migration

**Over-The-Air Updates (CodePush):**

```typescript
import codePush from "react-native-code-push";

const App = () => {
  // ...
};

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
})(App);
```

**Database Migrations (Prisma):**

```bash
# Créer une migration
npx prisma migrate dev --name add_tournament_feature

# Appliquer en production
npx prisma migrate deploy
```

### 12.3 Feature Flags

```typescript
// Simple feature flag system
const FeatureFlags = {
  TOURNAMENTS_ENABLED: __DEV__ || Config.ENV === 'staging',
  AI_COACHING: Config.SUBSCRIPTION_TIER === 'PREMIUM',
  NEW_SEARCH_UI: false,
};

// Usage
if (FeatureFlags.TOURNAMENTS_ENABLED) {
  return <TournamentsScreen />;
}
```

---

## 13. DOCUMENTATION DÉVELOPPEUR

### 13.1 README Complet

```markdown
# Paddle App

## Quick Start

### Prerequisites
- Node.js 20+
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

\`\`\`bash
# Clone repo
git clone https://github.com/yourcompany/paddle-app
cd paddle-app

# Install dependencies
npm install

# iOS
cd ios && pod install && cd ..

# Start Metro
npm start

# Run iOS
npm run ios

# Run Android
npm run android
\`\`\`

### Environment Setup

Copy `.env.example` to `.env` and fill in values:

\`\`\`bash
cp .env.example .env
\`\`\`

## Architecture

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## API Documentation

See [API.md](./docs/API.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
```

### 13.2 Documentation API (Swagger/OpenAPI)

```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Paddle App API',
      version: '1.0.0',
      description: 'API for Paddle mobile application',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
      { url: 'https://api.paddle-app.com', description: 'Production' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

---

## 14. BUDGET & TIMELINE DÉTAILLÉS

### 14.1 Coûts Techniques Mensuels (Après Launch)

**Infrastructure:**
- Hosting backend (Railway/DO): $50-150
- PostgreSQL managed: $25-50
- Redis: $10-25
- S3/Storage: $20-50
- CDN: $20-40
- **Subtotal infrastructure: $125-315/mois**

**Services:**
- Firebase (Analytics, Push): $0-25
- Sentry: $26-80
- Stripe: 2.9% + €0.25 par transaction
- **Subtotal services: $26-105/mois**

**Stores:**
- Apple Developer: $99/an
- Google Play: $25 unique
- **Subtotal: ~$10/mois**

**Total technique: $160-430/mois**

### 14.2 Timeline Développement

**MVP (12 semaines):**

- Semaines 1-2: Setup + Architecture + Design System
- Semaines 3-4: Authentification complète
- Semaines 5-6: Profils + Recherche + Matching
- Semaines 7-8: Réservations + Paiements
- Semaines 9-10: Matchs + Messagerie
- Semaines 11-12: Tests + Bug fixes + Submission stores

**Post-MVP (24 semaines):**

- Semaines 13-16: Statistiques + Classements
- Semaines 17-20: Social + Communauté
- Semaines 21-24: Coaching + Features premium

---

## 15. CHECKLIST DE LANCEMENT

### 15.1 Pre-Launch Checklist

**Technique:**
- [ ] Tous les tests passent (unit + e2e)
- [ ] Performance validée (Lighthouse, Detox)
- [ ] Pas de secrets en dur dans le code
- [ ] Analytics configurées et testées
- [ ] Crash reporting opérationnel
- [ ] Push notifications testées (iOS + Android)
- [ ] In-App Purchase testés en sandbox
- [ ] Backend scalable (load testing)
- [ ] Backups DB automatisés
- [ ] Monitoring et alertes configurés

**Légal & Compliance:**
- [ ] Politique de confidentialité
- [ ] CGU/CGV
- [ ] Mentions légales
- [ ] RGPD compliance
- [ ] Cookies banner
- [ ] Age rating approprié

**Stores:**
- [ ] App Store Connect configuré
- [ ] Google Play Console configuré
- [ ] Screenshots & descriptions
- [ ] Vidéo promo (optionnel mais recommandé)
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] TestFlight beta (iOS)
- [ ] Internal testing (Android)

**Business:**
- [ ] Landing page prête
- [ ] Support email configuré
- [ ] Plan marketing activé
- [ ] Partenariats clubs signés (minimum 5-10)
- [ ] Équipe support formée

---

## 16. CONCLUSION & PROCHAINES ÉTAPES

Ce document technique fournit une base solide pour développer l'application Paddle avec les meilleures pratiques de l'industrie.

**Points clés:**

1. **Stack moderne & éprouvé:** React Native + TypeScript + Node.js
2. **Architecture scalable:** Clean Architecture + API REST/GraphQL
3. **Développement rapide:** Utilisation intensive de Claude Code
4. **Monitoring complet:** Analytics, error tracking, performance
5. **Sécurité prioritaire:** Best practices appliquées

**Prochaines étapes immédiates:**

1. **Valider le stack technique** avec l'équipe
2. **Créer les repos GitHub** (app + api)
3. **Setup environnements** (dev, staging, prod)
4. **Commencer le développement MVP** avec Claude Code
5. **Recruter beta testeurs** (objectif: 100-500)

**Commandes pour démarrer MAINTENANT:**

```bash
# 1. Créer le projet mobile
npx react-native@latest init PaddleApp --template react-native-template-typescript

# 2. Créer le backend
mkdir paddle-api && cd paddle-api
npm init -y
npm install express prisma @prisma/client typescript
npx prisma init

# 3. Utiliser Claude Code pour générer rapidement
claude code "Setup complet du projet avec navigation, Redux, et design system"
```

**Bon développement ! 🎾📱**

---

**Document préparé par:** Claude  
**Version:** 1.0  
**Date:** 16 Novembre 2025  
**Technologies:** React Native, Node.js, PostgreSQL, Prisma
