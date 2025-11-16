# CLAUDE.md - AI Assistant Guide for Paddle-App

This document provides comprehensive guidance for AI assistants working on the Paddle-App codebase.

## Repository Overview

**Project Name:** Paddle-App
**Purpose:** Mobile application for paddle/padel players - Find partners, book courts, track performance
**Type:** React Native Mobile App (iOS/Android) + Node.js Backend API
**Status:** ✅ Development - Sprint 2 in progress (Booking System Complete!)
**Version:** 1.7.0
**Tech Stack:** React Native 0.74, TypeScript, Node.js 20, PostgreSQL, Prisma, Redux Toolkit, Stripe, Firebase, Socket.io
**Business Model:** Freemium with subscriptions (Standard: 9.99€/month, Premium: 14.99€/month)

## 🆕 Recent Updates (v1.7.0 - Sprint 2: Complete Booking System!)

### ✅ New Features Implemented:

**1. Social Authentication (Google/Apple/Facebook)** ✅
- ✅ Backend OAuth service (`paddle-api/src/services/oauth.service.ts`)
- ✅ OAuth routes (`paddle-api/src/routes/oauth.routes.ts`)
- ✅ Frontend SocialLoginButtons component
- ✅ Social auth configuration (`paddle-app/src/config/socialAuth.config.ts`)
- ✅ Updated auth service with social login methods

**2. Biometric Authentication (Face ID / Touch ID)** ✅
- ✅ Biometric service (`paddle-app/src/services/biometric.service.ts`)
- ✅ useBiometric hook (`paddle-app/src/hooks/useBiometric.ts`)
- ✅ BiometricSetting component for settings screen
- ✅ Support for iOS Face ID, Touch ID and Android Fingerprint

**3. Email Verification System** ✅
- ✅ Email service with templates (`paddle-api/src/services/email.service.ts`)
- ✅ Verification email, password reset, welcome email, booking confirmation
- ✅ Nodemailer integration for SMTP

**4. Subscription & In-App Purchase Module** ✅
- ✅ Subscription service (`paddle-app/src/services/subscription.service.ts`)
- ✅ useSubscription hook (`paddle-app/src/hooks/useSubscription.ts`)
- ✅ Support for iOS (StoreKit) and Android (Google Play Billing)
- ✅ Trial period management
- ✅ Purchase restoration
- ✅ Subscription status tracking

**5. Stripe Payment Integration** ✅
- ✅ Backend Stripe service with full subscription lifecycle (`paddle-api/src/services/stripe.service.ts`)
- ✅ Subscription routes with 8 endpoints (`paddle-api/src/routes/subscription.routes.ts`)
- ✅ Frontend Stripe service with Payment Sheet (`paddle-app/src/services/stripe.service.ts`)
- ✅ Beautiful Subscription Screen with plan comparison (`paddle-app/src/screens/subscription/SubscriptionScreen.tsx`)
- ✅ Webhook handling for automated sync
- ✅ Customer Portal for self-service
- ✅ 14-day free trial support
- ✅ Secure payment processing (PCI compliant)

**6. Firebase Push Notifications** ✅
- ✅ Backend notification service with Firebase Admin SDK (`paddle-api/src/services/notification.service.ts`)
- ✅ Notification routes with 5 endpoints (`paddle-api/src/routes/notification.routes.ts`)
- ✅ Frontend FCM service with multi-platform support (`paddle-app/src/services/notification.service.ts`)
- ✅ useNotifications hook for easy integration (`paddle-app/src/hooks/useNotifications.ts`)
- ✅ Device token management with automatic cleanup
- ✅ Notification templates for common events (messages, matches, bookings, payments)
- ✅ Android notification channels (default, matches, messages, bookings)
- ✅ Badge count management (iOS)
- ✅ Background and foreground notification handling
- ✅ Deep linking on notification tap

**7. Real-time Chat with Socket.io** ✅
- ✅ Socket.io backend configuration with JWT authentication (`paddle-api/src/config/socket.config.ts`)
- ✅ Chat service backend for REST API (`paddle-api/src/services/chat.service.ts`)
- ✅ Chat routes with 12 endpoints (`paddle-api/src/routes/chat.routes.ts`)
- ✅ Socket.io client service for real-time messaging (`paddle-app/src/services/chat.service.ts`)
- ✅ useChat hook for easy integration (`paddle-app/src/hooks/useChat.ts`)
- ✅ Direct and group conversations support
- ✅ Real-time message delivery and read receipts
- ✅ Typing indicators
- ✅ Offline message notifications (via FCM)
- ✅ Message pagination and history loading
- ✅ Conversation muting and deletion
- ✅ Unread count tracking
- ✅ Match chat support for in-game communication

**8. Geolocation & Maps** ✅ NEW!
- ✅ Geolocation service with permissions and tracking (`paddle-app/src/services/geolocation.service.ts`)
- ✅ useGeolocation hook for React integration (`paddle-app/src/hooks/useGeolocation.ts`)
- ✅ MapView component with react-native-maps (`paddle-app/src/components/map/MapView.tsx`)
- ✅ CourtMapView specialized component (`paddle-app/src/components/map/CourtMapView.tsx`)
- ✅ Location service backend for geographic search (`paddle-api/src/services/location.service.ts`)
- ✅ Location routes with 6 endpoints (`paddle-api/src/routes/location.routes.ts`)
- ✅ Haversine distance calculations
- ✅ Bounding box optimization for queries
- ✅ Location-based search (players, courts, clubs, matches)
- ✅ Distance sorting and filtering
- ✅ User location tracking and updates
- ✅ Geographic statistics and insights

**Progress:** Sprint 1 Complete + Sprint 2 (4/5 completed)
- ✅ **Sprint 1:** All 6 features complete (100%)
- ✅ **Sprint 2:** Real-time Chat (100%)
- ✅ **Sprint 2:** Geolocation & Maps (100%)
- ✅ **Sprint 2:** Complete Match Management (100%)
- ✅ **Sprint 2:** Complete Booking System (100%)
- ⏳ **Sprint 2:** Tournament System (0%)

**Completion:** ~80-85% of MVP completed (Booking and match systems operational!)

## Project Structure

The repository contains two main applications:

```
Paddle-App/
├── paddle-app/           # 📱 Mobile Application (React Native)
│   ├── src/
│   │   ├── api/          # API client & services
│   │   ├── assets/       # Images, icons, fonts
│   │   ├── components/   # React components
│   │   │   ├── common/   # Reusable components (Button, Input, Card)
│   │   │   ├── features/ # Feature-specific components
│   │   │   └── layouts/  # Layout components
│   │   ├── constants/    # Constants (colors, dimensions)
│   │   ├── hooks/        # Custom hooks (useTheme, useAuth)
│   │   ├── navigation/   # React Navigation structure
│   │   ├── screens/      # Screen components
│   │   │   ├── auth/     # Login, SignUp, Onboarding
│   │   │   ├── home/     # Dashboard
│   │   │   ├── search/   # Search players/courts
│   │   │   ├── booking/  # Court bookings
│   │   │   ├── matches/  # Match management
│   │   │   ├── profile/  # User profile
│   │   │   └── settings/ # Settings
│   │   ├── store/        # Redux store & slices
│   │   │   ├── slices/   # Redux slices (auth, app, user)
│   │   │   └── index.ts  # Store configuration
│   │   ├── theme/        # Design system
│   │   │   ├── theme.ts  # Main theme
│   │   │   └── typography.ts
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   ├── App.tsx           # App entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── babel.config.js
│
├── paddle-api/           # 🔌 Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/       # Configuration (database, redis)
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── routes/       # API routes
│   │   │   ├── auth.routes.ts
│   │   │   └── index.ts
│   │   ├── services/     # Business logic
│   │   │   └── auth.service.ts
│   │   ├── utils/        # Utilities
│   │   │   ├── jwt.utils.ts
│   │   │   └── logger.ts
│   │   └── index.ts      # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── migrations/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docs/                 # Documentation
├── CLAUDE.md            # This file
├── Document_Technique_PaddleApp.md
├── Document_Fonctionnel_Business_PaddleApp.md
└── Guide_Developpement_Web_Claude.md
```

## Tech Stack

### Mobile App (React Native)

**Core:**
- React Native 0.74
- TypeScript 5.3
- React 18.2

**Navigation:**
- @react-navigation/native 6.x
- @react-navigation/bottom-tabs
- @react-navigation/native-stack

**State Management:**
- Redux Toolkit (global state)
- React Query (server state)
- Redux Persist (persistence)

**UI & Styling:**
- React Native Paper (Material Design)
- Styled Components
- React Native Reanimated 3 (animations)
- @shopify/flash-list (performance)

**Forms:**
- React Hook Form
- Zod (validation)

**Features:**
- react-native-maps (maps)
- react-native-image-picker (photos)
- @react-native-firebase (push notifications, analytics)
- react-native-iap (in-app purchases)
- Socket.io-client (real-time chat)

**Dev Tools:**
- Jest (testing)
- Detox (E2E testing)
- Sentry (error tracking)

### Backend API (Node.js)

**Core:**
- Node.js 20 LTS
- TypeScript 5.3
- Express 4.x

**Database:**
- PostgreSQL 16
- Prisma 5.x (ORM)
- Redis (cache, sessions)

**Authentication:**
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- Passport.js (OAuth)

**External Services:**
- Stripe (payments)
- Firebase Admin (push notifications)
- AWS S3 (file storage)
- Socket.io (WebSocket)

**Dev Tools:**
- Winston (logging)
- Sentry (error tracking)
- Jest (testing)

## Development Workflows

### Backend Setup

```bash
cd paddle-api

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev

# Server runs on http://localhost:3000
```

### Mobile App Setup

```bash
cd paddle-app

# Install dependencies
npm install

# iOS: Install pods
cd ios && pod install && cd ..

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Branch Strategy

- **Main Branch:** `claude/dev-from-technical-doc-01Jt3VM4FqPJMAqArK7cRF9N` - development branch
- **Feature Branches:** `feature/<feature-name>`
- **Bug Fix Branches:** `fix/<bug-description>`

### Commit Conventions

Follow Conventional Commits:

```
feat: add player search functionality
fix: resolve JWT token expiration issue
docs: update API documentation
style: format code with Prettier
refactor: extract auth service logic
test: add unit tests for auth service
chore: update dependencies
```

## Design System

### Colors

- **Primary:** #0066FF (Blue)
- **Secondary:** #00D084 (Green)
- **Accent:** #FF6B35 (Orange)
- **Text:** #2C3E50 (Dark gray)
- **Background:** #F8F9FA (Light gray)

### Spacing System

Based on 8pt grid:
- xs: 4px
- sm: 8px
- md: 12px
- base: 16px
- lg: 24px
- xl: 32px
- xxl: 40px
- xxxl: 48px

### Typography

- **H1:** 40px (Bold)
- **H2:** 32px (Bold)
- **H3:** 24px (Semibold)
- **Body:** 16px (Regular)
- **Caption:** 12px (Regular)

## Database Schema

### Key Models

**User:**
- Basic info (email, name, username)
- Paddle info (skillLevel, preferredPosition, dominantHand)
- Subscription (tier, start, end)
- Location (city, lat, lon)
- Social auth (googleId, appleId, facebookId)

**Match:**
- Type (FRIENDLY, RANKED, TRAINING, TOURNAMENT)
- Format (SINGLES, DOUBLES)
- Status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- Organizer, participants, court, scores

**Court & Club:**
- Club info (name, address, facilities, photos)
- Court (type: INDOOR/OUTDOOR, surface, price)
- Availability, bookings

**Booking:**
- User, court, time slot
- Status (PENDING, CONFIRMED, CANCELLED)
- Payment info

**Messages:**
- Direct and group conversations
- Real-time chat for matches

See `paddle-api/prisma/schema.prisma` for full schema.

## API Endpoints

### Authentication

```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login with email/password
POST   /api/auth/refresh       - Refresh access token
POST   /api/auth/forgot-password - Request password reset
POST   /api/auth/reset-password  - Reset password
POST   /api/auth/logout        - Logout
```

### Users

```
GET    /api/users/me           - Get current user
PUT    /api/users/me           - Update profile
GET    /api/users/:id          - Get user profile
GET    /api/users/search       - Search players (filters: level, location, radius)
GET    /api/users/:id/statistics - Get user stats
```

### Matches

```
GET    /api/matches            - List matches (with filters)
POST   /api/matches            - Create match
GET    /api/matches/:id        - Get match details
PUT    /api/matches/:id        - Update match
DELETE /api/matches/:id        - Delete match
POST   /api/matches/:id/join   - Join match
POST   /api/matches/:id/leave  - Leave match
```

### Bookings

```
GET    /api/bookings           - My bookings
POST   /api/bookings           - Create booking
GET    /api/bookings/:id       - Get booking
PUT    /api/bookings/:id       - Modify booking
DELETE /api/bookings/:id       - Cancel booking
```

### Clubs & Courts

```
GET    /api/clubs              - List clubs
GET    /api/clubs/:id          - Get club details
GET    /api/clubs/:id/courts   - Club courts
GET    /api/courts/:id/availability - Court availability
```

## Redux Store Structure

```typescript
{
  auth: {
    isAuthenticated: boolean,
    user: User | null,
    accessToken: string | null,
    refreshToken: string | null,
    loading: boolean,
    error: string | null
  },
  app: {
    theme: 'light' | 'dark' | 'auto',
    language: 'fr' | 'en' | 'es',
    notificationsEnabled: boolean,
    locationPermissionGranted: boolean,
    onboardingCompleted: boolean
  },
  user: {
    statistics: UserStatistics | null,
    favorites: string[],
    blockedUsers: string[],
    searchHistory: string[]
  }
}
```

## Navigation Structure

```
RootNavigator
├── Auth Stack (if not authenticated)
│   ├── Onboarding
│   ├── Login
│   ├── SignUp
│   └── ForgotPassword
│
└── Main Tab Navigator (if authenticated)
    ├── Home
    ├── Search
    ├── Matches
    ├── Profile
    └── More
```

## Common Components Library

All components are located in `paddle-app/src/components/common/` and can be imported using the barrel export:

```typescript
import { Button, Input, Card, Avatar, Loading, ErrorMessage, Badge } from '@/components/common';
```

### Available Components

#### 1. Button (`Button.tsx`)
A comprehensive button component with multiple variants and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'small' | 'medium' | 'large'
- `loading`: boolean - Shows loading indicator
- `disabled`: boolean
- `icon`: string - MaterialCommunityIcons name
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean

**Example:**
```typescript
<Button
  title="Sign In"
  onPress={handleLogin}
  variant="primary"
  size="large"
  loading={isLoading}
  icon="login"
  iconPosition="left"
  fullWidth
/>
```

#### 2. Input (`Input.tsx`)
Feature-rich text input with validation, icons, and password toggle.

**Props:**
- `label`: string - Input label
- `value`: string
- `onChangeText`: (text: string) => void
- `error`: string - Error message to display
- `hint`: string - Helper text
- `leftIcon`: string - Icon on the left
- `rightIcon`: string - Icon on the right
- `secureTextEntry`: boolean - Password mode
- `required`: boolean - Shows asterisk
- `disabled`: boolean
- All standard TextInput props

**Example:**
```typescript
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  leftIcon="email"
  error={emailError}
  required
  autoCapitalize="none"
  keyboardType="email-address"
/>

<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  leftIcon="lock"
  secureTextEntry
  required
/>
```

#### 3. Card (`Card.tsx`)
Flexible container component with header, content, and footer.

**Main Component Props:**
- `variant`: 'elevated' | 'outlined' | 'filled'
- `padding`: 'none' | 'small' | 'medium' | 'large'
- `onPress`: () => void - Makes card touchable
- `children`: ReactNode

**Sub-components:** `CardHeader`, `CardContent`, `CardFooter`

**Example:**
```typescript
<Card variant="elevated" onPress={() => navigation.navigate('Details')}>
  <CardHeader>
    <Text style={styles.title}>Match Title</Text>
  </CardHeader>
  <CardContent>
    <Text>Match details go here...</Text>
  </CardContent>
  <CardFooter>
    <Button title="Join Match" onPress={handleJoin} />
  </CardFooter>
</Card>
```

#### 4. Avatar (`Avatar.tsx`)
Avatar component with image, initials fallback, badges, and group support.

**Avatar Props:**
- `uri`: string - Image URL
- `name`: string - For initials fallback
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
- `variant`: 'circular' | 'rounded' | 'square'
- `badge`: boolean - Show badge
- `badgeColor`: string
- `badgePosition`: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
- `onPress`: () => void

**AvatarGroup Props:**
- `avatars`: Array of avatar data
- `max`: number - Max avatars to show
- `size`: Avatar size
- `spacing`: number - Overlap spacing

**Example:**
```typescript
<Avatar
  uri="https://example.com/avatar.jpg"
  name="John Doe"
  size="lg"
  variant="circular"
  badge
  badgeColor={theme.colors.success}
  onPress={() => navigation.navigate('Profile')}
/>

<AvatarGroup
  avatars={[
    { uri: 'url1', name: 'User 1' },
    { uri: 'url2', name: 'User 2' },
    { uri: 'url3', name: 'User 3' },
  ]}
  max={3}
  size="md"
/>
```

#### 5. Loading (`Loading.tsx`)
Loading indicator for async operations.

**Props:**
- `fullscreen`: boolean - Overlay mode
- `text`: string - Loading message
- `size`: 'small' | 'large'
- `color`: string

**Example:**
```typescript
// Fullscreen loading
<Loading fullscreen text="Loading matches..." />

// Inline loading
<Loading size="small" />
```

#### 6. ErrorMessage (`ErrorMessage.tsx`)
Error display component with retry functionality.

**Props:**
- `message`: string - Error message
- `onRetry`: () => void - Retry callback
- `fullscreen`: boolean - Overlay mode

**Example:**
```typescript
<ErrorMessage
  message="Failed to load matches"
  onRetry={refetch}
/>

// Fullscreen error
<ErrorMessage
  message="Something went wrong"
  onRetry={handleRetry}
  fullscreen
/>
```

#### 7. Badge (`Badge.tsx`)
Colored badge with specialized variants for skills and subscriptions.

**Badge Props:**
- `label`: string
- `variant`: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'pro'
- `size`: 'small' | 'medium' | 'large'
- `icon`: string - MaterialCommunityIcons name

**Specialized Components:**
- `SkillBadge`: For skill levels (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT, PRO)
- `SubscriptionBadge`: For subscription tiers (FREE, STANDARD, PREMIUM)

**Example:**
```typescript
<Badge label="Active" variant="success" size="small" />

<SkillBadge level="ADVANCED" size="medium" />

<SubscriptionBadge tier="PREMIUM" size="small" />
```

### Component Guidelines

1. **Theme Integration:** All components use `useTheme()` hook for consistent styling
2. **TypeScript:** Full type safety with strict interfaces
3. **Customization:** Support style overrides via `style` prop
4. **Accessibility:** Include accessibility labels where appropriate
5. **Performance:** Optimized with React.memo where needed
6. **Icons:** Use MaterialCommunityIcons for consistency

### Creating New Components

When adding new common components:

1. Create in `paddle-app/src/components/common/`
2. Use TypeScript with strict typing
3. Integrate with theme system via `useTheme()`
4. Add to barrel export in `index.ts`
5. Document in this CLAUDE.md file
6. Follow existing naming conventions

## Feature Components Library

Feature components are domain-specific components located in `paddle-app/src/components/features/`:

```typescript
import { PlayerCard, MatchCard, CourtCard } from '@/components/features';
```

### Available Feature Components

#### 1. PlayerCard (`PlayerCard.tsx`)
Displays player information with stats and actions.

**Props:**
- `player`: PlayerCardData - Player data
- `onPress`: () => void - Card press handler
- `onMessagePress`: () => void - Message button handler
- `onInvitePress`: () => void - Invite button handler
- `variant`: 'default' | 'compact' - Display variant

**PlayerCardData:**
- `id`, `firstName`, `lastName`, `username`
- `skillLevel`: Skill level enum
- `distance`, `matchesPlayed`, `winRate` (optional)
- `isOnline`: boolean (optional)

**Example:**
```typescript
<PlayerCard
  player={{
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    username: 'jeandupont',
    skillLevel: 'INTERMEDIATE',
    distance: '2.3 km',
    matchesPlayed: 45,
    winRate: 62,
  }}
  onPress={() => navigate('PlayerProfile')}
  onMessagePress={handleMessage}
  onInvitePress={handleInvite}
/>
```

#### 2. MatchCard (`MatchCard.tsx`)
Displays match information with join/leave functionality.

**Props:**
- `match`: MatchCardData - Match data
- `onPress`: () => void - Card press handler
- `onJoinPress`: () => void - Join button handler
- `onLeavePress`: () => void - Leave button handler
- `isJoined`: boolean - User participation status
- `variant`: 'default' | 'compact' - Display variant

**MatchCardData:**
- `id`, `title`, `type`, `format`, `skillLevel`
- `date`, `time`, `court`, `organizer`
- `participants`: Array of players
- `maxPlayers`: number
- `distance`, `price` (optional)

**Example:**
```typescript
<MatchCard
  match={{
    id: '1',
    title: 'Match amical',
    type: 'FRIENDLY',
    format: 'DOUBLES',
    skillLevel: 'INTERMEDIATE',
    date: '2025-11-17',
    time: '14:00',
    court: 'Padel Center',
    organizer: 'Jean Dupont',
    participants: [/* ... */],
    maxPlayers: 4,
  }}
  onPress={() => navigate('MatchDetails')}
  onJoinPress={handleJoin}
  isJoined={false}
/>
```

#### 3. CourtCard (`CourtCard.tsx`)
Displays court information with booking functionality.

**Props:**
- `court`: CourtCardData - Court data
- `onPress`: () => void - Card press handler
- `onBookPress`: () => void - Book button handler
- `variant`: 'default' | 'compact' - Display variant

**CourtCardData:**
- `id`, `name`, `clubName`, `type`, `surface`
- `pricePerHour`: number
- `rating`, `reviewsCount` (optional)
- `courtsAvailable`, `totalCourts` (optional)
- `hasLighting`, `hasParking`, `hasShower` (optional)

**Example:**
```typescript
<CourtCard
  court={{
    id: '1',
    name: 'Padel Center Paris',
    clubName: 'Club Sportif',
    type: 'INDOOR',
    surface: 'ARTIFICIAL_GRASS',
    pricePerHour: 25,
    rating: 4.5,
    courtsAvailable: 3,
    totalCourts: 6,
  }}
  onPress={() => navigate('CourtDetails')}
  onBookPress={handleBook}
/>
```

## Screens

### MoreScreen (Settings)

The MoreScreen (`paddle-app/src/screens/settings/MoreScreen.tsx`) provides comprehensive app settings and preferences.

**Features:**
- **5 Main Sections:** Account, Preferences, Activity, Support, Legal
- **Theme Selection:** Light/Dark/Auto with Redux integration
- **Language Selection:** French/English/Spanish with Redux integration
- **Notifications Toggle:** Enable/disable push notifications
- **Subscription Display:** Shows current tier (FREE/STANDARD/PREMIUM)
- **User Profile:** Quick access to profile screen
- **Logout:** Confirmation dialog before disconnecting

**Structure:**

```typescript
// MoreScreen sections
export const MoreScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const appSettings = useAppSelector((state) => state.app);
  const user = useAppSelector((state) => state.auth.user);

  // Sections:
  // 1. Account - Profile, Subscription
  // 2. Preferences - Notifications, Theme, Language
  // 3. Activity - History, Favorites, Statistics
  // 4. Support - Help/FAQ, Contact, Rate app
  // 5. Legal - Terms, Privacy, About
};
```

**Redux Actions:**

- `setTheme(theme)` - Change app theme (light/dark/auto)
- `setLanguage(lang)` - Change app language (fr/en/es)
- `toggleNotifications()` - Enable/disable notifications
- `logout()` - Log out user

**Settings Items:**

Each setting uses the `SettingsItem` component with:
- Icon (Material Community Icons)
- Title and optional subtitle
- Optional right element (Switch, Chevron, Badge)
- onPress handler for navigation or actions
- testID for testing

**Example Usage:**

```typescript
<SettingsItem
  icon="theme-light-dark"
  title="Thème"
  subtitle={getThemeLabel()} // "Clair", "Sombre", "Automatique"
  onPress={handleThemeChange}
  testID="settings-theme"
/>

<SettingsItem
  icon="bell"
  title="Notifications"
  subtitle="Activer les notifications push"
  showChevron={false}
  rightElement={
    <Switch
      value={appSettings.notificationsEnabled}
      onValueChange={handleNotificationsToggle}
      testID="settings-notifications-switch"
    />
  }
  testID="settings-notifications"
/>
```

**Navigation Integration:**

- Integrates with React Navigation bottom tabs
- Tab icon: `menu` (MaterialCommunityIcons)
- Tab label: "Plus"
- No header shown (headerShown: false)

**Testing:**

Comprehensive test suite with 25 tests covering:
- All sections rendering correctly
- Theme management (light/dark/auto) with Redux
- Language management (fr/en/es) with Redux
- Notifications toggle
- Subscription tier display (FREE/STANDARD/PREMIUM)
- Navigation to profile
- Logout with confirmation

All tests in `__tests__/screens/MoreScreen.test.tsx` pass (25/25).

## Common Patterns

### Axios Configuration

The app uses a configured axios instance with automatic token refresh and error handling:

```typescript
// paddle-app/src/api/axios.config.ts
import axios from 'axios';
import { store } from '@/store';
import { logout, updateTokens } from '@/store/slices/authSlice';

// Configured instance with interceptors
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Request interceptor - adds auth token
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = store.getState().auth;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor - handles token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Automatic token refresh on 401
    // Request queuing during refresh
    // Logout on refresh failure
  }
);
```

**Features:**
- Automatic token injection in Authorization header
- Token refresh on 401 with request queue
- Error handling with typed helpers
- Development logging
- Network/timeout error detection

**Helpers:**
```typescript
import { getErrorMessage, isNetworkError, isTimeoutError, isAuthError } from '@/api/axios.config';

// Extract user-friendly error messages
const message = getErrorMessage(error);

// Check error types
if (isNetworkError(error)) { /* No internet */ }
if (isTimeoutError(error)) { /* Request timeout */ }
if (isAuthError(error)) { /* Not authenticated */ }
```

### API Service Pattern

All API services follow a consistent pattern:

```typescript
// paddle-app/src/api/services/auth.service.ts
import axios from '../axios.config';

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post('/auth/logout');
  },

  async refreshToken(data: RefreshTokenData): Promise<TokenResponse> {
    const response = await axios.post<TokenResponse>('/auth/refresh', data);
    return response.data;
  },
};
```

**Available Services:**

1. **authService** (`auth.service.ts`):
   - `register(data)` - Create new account
   - `login(data)` - Authenticate user
   - `logout()` - End session
   - `refreshToken(data)` - Refresh access token
   - `forgotPassword(data)` - Request password reset
   - `resetPassword(data)` - Reset password with token
   - `verifyEmail(token)` - Verify email address
   - `resendVerificationEmail()` - Resend verification email

2. **userService** (`user.service.ts`):
   - `getMe()` - Get current user profile
   - `getUserById(id)` - Get user by ID
   - `updateProfile(data)` - Update profile
   - `uploadAvatar(formData)` - Upload profile picture
   - `deleteAvatar()` - Remove profile picture
   - `getMyStatistics()` - Get user stats
   - `getUserStatistics(id)` - Get user stats by ID
   - `searchPlayers(params)` - Search players with filters
   - `addFavorite(id)` / `removeFavorite(id)` - Manage favorites
   - `getFavorites()` - List favorite players
   - `blockUser(id)` / `unblockUser(id)` - Manage blocked users
   - `getBlockedUsers()` - List blocked users

3. **matchService** (`match.service.ts`):
   - `getMatches(params)` - Search matches with filters
   - `getMatchById(id)` - Get match details
   - `createMatch(data)` - Create new match
   - `updateMatch(id, data)` - Update match
   - `deleteMatch(id)` - Delete match
   - `joinMatch(id)` - Join a match
   - `leaveMatch(id)` - Leave a match
   - `invitePlayer(matchId, userId)` - Invite player to match
   - `respondToInvitation(matchId, response)` - Accept/decline invitation
   - `getMyMatches(params)` - Get my participated matches
   - `getMyOrganizedMatches(params)` - Get matches I organized
   - `updateScore(id, score)` - Update match score
   - `completeMatch(id)` - Mark match as completed
   - `cancelMatch(id, reason)` - Cancel match

4. **courtService** (`court.service.ts`):
   - `searchClubs(params)` - Search clubs/venues
   - `getClubById(id)` - Get club details
   - `getClubCourts(id)` - Get club's courts
   - `getCourtById(id)` - Get court details
   - `getCourtAvailability(id, date)` - Check availability
   - `createBooking(data)` - Book a court
   - `getMyBookings(params)` - List my bookings
   - `getBookingById(id)` - Get booking details
   - `updateBooking(id, data)` - Modify booking
   - `cancelBooking(id)` - Cancel booking
   - `getClubReviews(id, params)` - Get club reviews
   - `addReview(id, data)` - Add review
   - `updateReview(id, data)` / `deleteReview(id)` - Manage reviews
   - `addFavoriteClub(id)` / `removeFavoriteClub(id)` - Manage favorite clubs
   - `getFavoriteClubs()` - List favorite clubs

**Usage Example:**

```typescript
import { authService, userService, matchService } from '@/api/services';

// Login
try {
  const response = await authService.login({
    email: 'user@example.com',
    password: 'password123',
  });
  dispatch(loginSuccess({
    user: response.user,
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
  }));
} catch (error) {
  const message = getErrorMessage(error);
  setError(message);
}

// Search players
const result = await userService.searchPlayers({
  skillLevel: 'INTERMEDIATE',
  city: 'Paris',
  radius: 10,
  page: 1,
  limit: 20,
});

// Create match
const match = await matchService.createMatch({
  title: 'Match amical',
  type: 'FRIENDLY',
  format: 'DOUBLES',
  skillLevel: 'INTERMEDIATE',
  dateTime: '2025-11-17T14:00:00Z',
  duration: 90,
  courtId: 'court-123',
  maxPlayers: 4,
});
```

### Redux Slice Pattern

```typescript
// paddle-app/src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginData>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    },
  },
});
```

### Component Pattern

```typescript
// paddle-app/src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, { backgroundColor: theme.colors.primary }]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
```

## Testing Strategy

### Backend Tests

```bash
cd paddle-api

# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

Example:
```typescript
// paddle-api/tests/services/auth.service.test.ts
describe('AuthService', () => {
  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const result = await AuthService.login('user@example.com', 'password123');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
    });

    it('should throw error with invalid credentials', async () => {
      await expect(
        AuthService.login('user@example.com', 'wrongpassword')
      ).rejects.toThrow('Email ou mot de passe incorrect');
    });
  });
});
```

### Mobile Tests

**Jest Configuration:**

The app uses Jest with React Native preset configured in `jest.config.js`:

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-vector-icons)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Support for @ imports
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

**Setup File (`jest.setup.js`):**

Mocks for native modules are configured in `jest.setup.js`:
- React Native core modules
- AsyncStorage
- Vector Icons
- Safe Area Context
- React Native Reanimated
- React Navigation

**Shared Theme Mock:**

A comprehensive theme mock is available in `__tests__/helpers/theme-mock.ts` for consistent testing:

```typescript
import { mockTheme } from '../helpers/theme-mock';

jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockTheme,
}));
```

The mock includes all theme properties: colors, spacing, borderRadius, dimensions, fontFamily, fontSize, shadows, etc.

**Running Tests:**

```bash
cd paddle-app

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- __tests__/components/Button.test.tsx

# Run tests with coverage
npm test -- --coverage

# E2E tests (Detox)
npm run detox:build:ios
npm run detox:test:ios
```

#### Component Tests

All common components have comprehensive test coverage located in `__tests__/components/`:

**Button.test.tsx:**
- Renders correctly with title
- Calls onPress when pressed
- Disabled state prevents onPress
- Loading state displays ActivityIndicator
- Supports all variants (primary, secondary, outline, ghost, danger)
- Supports all sizes (small, medium, large)
- Renders with icons (left/right)
- Full width layout
- Custom styles

**Input.test.tsx:**
- Renders label and required asterisk
- Calls onChangeText when text changes
- Displays error and hint messages
- Password toggle functionality
- Renders left/right icons
- Disabled state
- Focus/Blur callbacks
- Form validation

**Card.test.tsx:**
- Renders children correctly
- All variants (elevated, outlined, filled)
- Touchable with onPress
- CardHeader, CardContent, CardFooter sub-components
- Complete card with all sections

**Badge.test.tsx:**
- Renders label correctly
- All variants (primary, secondary, success, error, warning, info)
- All sizes (small, medium, large)
- Icon support
- SkillBadge with all skill levels
- SubscriptionBadge with all tiers

**Avatar.test.tsx:**
- Renders initials when no URI provided
- All sizes (xs, sm, md, lg, xl, xxl)
- All variants (circular, rounded, square)
- Badge display with positioning
- Correct initial extraction from names
- AvatarGroup with multiple avatars
- Max avatars limit with remainder count

**Loading.test.tsx:**
- Renders loading indicator
- Text display
- Fullscreen and inline modes

**ErrorMessage.test.tsx:**
- Renders error message
- Retry button functionality
- Calls onRetry callback
- Fullscreen mode

#### Feature Component Tests

All feature components have comprehensive test coverage located in `__tests__/features/`:

**PlayerCard.test.tsx:**
- Renders correctly with player data
- Displays player stats (distance, matches, win rate)
- Calls onPress when card is pressed
- Renders message and invite buttons
- Compact variant support
- Handles missing optional data gracefully

**MatchCard.test.tsx:**
- Renders correctly with match data
- Displays match type labels (Amical, Classé, etc.)
- Shows participant count correctly
- Join/Leave button functionality
- Disables join button when match is full
- Displays price when provided
- Compact variant support
- Different match types rendering

**CourtCard.test.tsx:**
- Renders correctly with court data
- Displays rating and reviews
- Shows distance and type correctly
- Surface type labels (Gazon synthétique, Béton, Verre)
- Availability status (Disponible/Complet)
- Book button functionality
- Disables book button when unavailable
- Compact variant support
- Indoor/Outdoor type display

#### Test Best Practices

1. **Mock Theme Hook:**
```typescript
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    colors: { /* ... */ },
    spacing: { /* ... */ },
    // ... other theme properties
  }),
}));
```

2. **Use TestIDs:**
All components include `testID` props for reliable testing:
```typescript
<Button testID="button-container" />
<ActivityIndicator testID="button-loading-indicator" />
<Icon testID="button-icon" />
```

3. **Test User Interactions:**
```typescript
const onPressMock = jest.fn();
const { getByText } = render(<Button title="Click" onPress={onPressMock} />);
fireEvent.press(getByText('Click'));
expect(onPressMock).toHaveBeenCalledTimes(1);
```

4. **Test Component States:**
```typescript
// Test loading state
render(<Button title="Submit" loading />);
// Test disabled state
render(<Button title="Submit" disabled />);
// Test error state
render(<Input error="Invalid input" />);
```

#### Running Tests

To run tests before committing:
```bash
cd paddle-app
npm test -- --coverage --watchAll=false
```

This ensures all components maintain high test coverage and functionality.

## Security Checklist

Before pushing changes:

- [ ] No API keys, secrets, or tokens in code
- [ ] All API keys in `.env` files (not committed)
- [ ] JWT tokens have expiration
- [ ] Passwords are hashed with bcryptjs
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevention (input validation)
- [ ] CSRF protection implemented
- [ ] Rate limiting on API endpoints
- [ ] HTTPS enforced in production
- [ ] User input validated (Zod)
- [ ] Authentication required on protected routes
- [ ] Proper error messages (no sensitive info)

## Deployment

### Backend (Node.js API)

**Recommended: Railway.app**

```bash
# Connect GitHub repo
# Set environment variables in Railway dashboard
# Auto-deploy on push to main
```

**Environment Variables Required:**
- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- STRIPE_SECRET_KEY
- FIREBASE credentials
- AWS S3 credentials

### Mobile App

**iOS:**
1. Configure in Xcode
2. Archive and upload to App Store Connect
3. Submit for review

**Android:**
1. Build release APK: `cd android && ./gradlew assembleRelease`
2. Upload to Google Play Console
3. Submit for review

## Troubleshooting

### Common Issues

**Metro bundler not starting:**
```bash
npx react-native start --reset-cache
```

**iOS build fails:**
```bash
cd ios && pod install && cd ..
npm run ios
```

**Android build fails:**
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

**Database migration issues:**
```bash
cd paddle-api
npx prisma migrate reset
npx prisma migrate dev
```

## Resources

### Documentation
- Technical Doc: `Document_Technique_PaddleApp.md`
- Functional Doc: `Document_Fonctionnel_Business_PaddleApp.md`
- Dev Guide: `Guide_Developpement_Web_Claude.md`

### External Docs
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Prisma](https://www.prisma.io/docs)
- [Express.js](https://expressjs.com/)

## AI Assistant Guidelines

### When Making Changes

1. **Read First:** Always read existing files before editing
2. **Consistency:** Follow existing patterns and style
3. **TypeScript:** Use strict typing, no `any`
4. **Testing:** Add tests for new functionality
5. **Documentation:** Update docs for significant changes

### Adding New Features

**Example: Adding a new screen**

1. Create screen component in `paddle-app/src/screens/[category]/`
2. Add to navigation in appropriate navigator
3. Add types to `navigation/types.ts`
4. Create necessary API services
5. Add Redux actions if needed
6. Write tests

**Example: Adding new API endpoint**

1. Add route in `paddle-api/src/routes/`
2. Create controller in `controllers/`
3. Create service in `services/`
4. Add validation middleware
5. Update Prisma schema if needed
6. Write tests
7. Update CLAUDE.md

### Code Review Checklist

- [ ] TypeScript strict mode compliant
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Edge cases considered
- [ ] Responsive design (mobile)
- [ ] Accessibility labels added
- [ ] Comments for complex logic
- [ ] Tests written and passing

## New Modules & Services (v1.1.0)

### Social Authentication Module

**Backend (`paddle-api/src/services/oauth.service.ts`):**
- Google OAuth authentication with token verification
- Apple Sign-In with identity token validation
- Facebook Login with Graph API integration
- Automatic user account linking with existing emails
- Unique username generation
- JWT token generation for authenticated sessions

**Routes (`paddle-api/src/routes/oauth.routes.ts`):**
- `POST /api/oauth/google` - Authenticate with Google ID token
- `POST /api/oauth/apple` - Authenticate with Apple identity token
- `POST /api/oauth/facebook` - Authenticate with Facebook access token

**Frontend:**
- **SocialLoginButtons Component** (`paddle-app/src/components/auth/SocialLoginButtons.tsx`)
  - Pre-configured buttons for Google, Apple (iOS only), and Facebook
  - Loading states for each provider
  - Error handling with user-friendly messages
  - Redux integration for storing auth state

- **Configuration** (`paddle-app/src/config/socialAuth.config.ts`)
  - Google Sign-In configuration
  - Facebook SDK initialization
  - Auto-initialization helper

**Updated Services:**
- `authService.loginWithGoogle(idToken)` - Call backend OAuth endpoint
- `authService.loginWithApple(identityToken, user?)` - Apple authentication
- `authService.loginWithFacebook(accessToken)` - Facebook authentication

**Usage Example:**
```typescript
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';

<SocialLoginButtons
  onSuccess={() => navigation.navigate('Home')}
  onError={(error) => Alert.alert('Erreur', error)}
/>
```

---

### Biometric Authentication Module

**Service (`paddle-app/src/services/biometric.service.ts`):**
- Face ID support (iOS)
- Touch ID support (iOS)
- Fingerprint authentication (Android)
- Availability checking per device
- Enable/disable biometric preference storage
- Fallback to password authentication

**Hook (`paddle-app/src/hooks/useBiometric.ts`):**
Simplified React hook for component usage:
```typescript
const {
  isAvailable,      // Boolean: biometry available on device
  isEnabled,        // Boolean: user has enabled it
  biometryType,     // 'FaceID' | 'TouchID' | 'Biometrics'
  authenticate,     // Function: prompt biometric auth
  enable,           // Function: enable biometric login
  disable,          // Function: disable biometric login
  getBiometricName, // Function: get localized name
} = useBiometric();
```

**Component (`paddle-app/src/components/settings/BiometricSetting.tsx`):**
- Settings toggle for enabling/disabling biometric auth
- Displays appropriate icon (face-recognition or fingerprint)
- Confirmation dialogs for enable/disable actions
- Auto-hides if biometry not available

**Usage Example:**
```typescript
import { useBiometric } from '@/hooks/useBiometric';

const LoginScreen = () => {
  const { isEnabled, authenticate } = useBiometric();

  const handleBiometricLogin = async () => {
    if (isEnabled) {
      const success = await authenticate('Connectez-vous à Paddle App');
      if (success) {
        // Proceed with login
      }
    }
  };
};
```

---

### Email Service Module

**Backend Service (`paddle-api/src/services/email.service.ts`):**
Complete email transactional system with beautiful HTML templates:

**Methods:**
- `sendEmail(options)` - Generic email sender
- `sendVerificationEmail(userId, email)` - Email verification with token
- `sendPasswordResetEmail(email, resetToken)` - Password reset link
- `sendWelcomeEmail(email, firstName)` - Welcome email after activation
- `sendBookingConfirmation(email, bookingDetails)` - Booking confirmation

**Features:**
- HTML email templates with modern design
- Responsive layout for mobile/desktop
- Brand colors (#0066FF primary, #00D084 secondary)
- Nodemailer integration for SMTP
- Automatic text version generation
- Professional styling with gradient headers

**Email Templates Include:**
- ✅ Verification email with expiring link (24h)
- ✅ Password reset with security warning (1h expiry)
- ✅ Welcome email with app features overview
- ✅ Booking confirmation with all details
- Future: Match reminders, subscription renewals, etc.

**Configuration Required:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FRONTEND_URL=https://paddle-app.com
```

**Usage Example:**
```typescript
import { EmailService } from '../services/email.service';

// Send verification email
await EmailService.sendVerificationEmail(user.id, user.email);

// Send booking confirmation
await EmailService.sendBookingConfirmation(user.email, {
  courtName: 'Padel Center Paris',
  date: '17 novembre 2025',
  time: '14:00',
  duration: 90,
  price: 25,
});
```

---

### Subscription & In-App Purchase Module

**Service (`paddle-app/src/services/subscription.service.ts`):**
Complete IAP management for iOS and Android:

**Features:**
- StoreKit 2 (iOS) and Google Play Billing 6 (Android) integration
- Subscription products management
- Purchase flow handling
- Receipt verification with backend
- Purchase restoration (important for iOS App Review)
- Subscription cancellation (redirects to store settings)
- Trial period support
- Auto-renewal management

**Product SKUs:**
```typescript
SUBSCRIPTION_SKUS = {
  STANDARD_MONTHLY: 'com.paddleapp.standard.monthly',
  PREMIUM_MONTHLY: 'com.paddleapp.premium.monthly',
  PREMIUM_ANNUAL: 'com.paddleapp.premium.annual',
}
```

**Methods:**
- `initialize()` - Connect to store and setup listeners
- `getProducts()` - Fetch available subscriptions
- `purchaseSubscription(productId)` - Initiate purchase
- `restorePurchases()` - Restore previous purchases
- `cancelSubscription()` - Guide user to cancel
- `checkSubscriptionStatus()` - Get current subscription state

**Hook (`paddle-app/src/hooks/useSubscription.ts`):**
React hook for easy subscription management:

```typescript
const {
  products,         // Available subscription products
  status,           // Current subscription status
  tier,             // 'FREE' | 'STANDARD' | 'PREMIUM'
  isSubscribed,     // Boolean
  expiryDate,       // Date | null
  isTrialActive,    // Boolean
  loading,          // Initial load state
  purchasing,       // Purchase in progress
  subscribe,        // (productId) => Promise<boolean>
  restore,          // () => Promise<boolean>
  cancel,           // () => Promise<void>
  startTrial,       // (tier) => Promise<boolean>
  canUpgrade,       // () => boolean
  getProductPrice,  // (productId) => string | null
} = useSubscription();
```

**Usage Example:**
```typescript
import { useSubscription } from '@/hooks/useSubscription';
import { SUBSCRIPTION_SKUS } from '@/services/subscription.service';

const SubscriptionScreen = () => {
  const { products, subscribe, loading, tier } = useSubscription();

  const handleSubscribe = async () => {
    const success = await subscribe(SUBSCRIPTION_SKUS.PREMIUM_MONTHLY);
    if (success) {
      Alert.alert('Succès !', 'Vous êtes maintenant Premium !');
    }
  };

  return (
    <View>
      {products.map(product => (
        <Button
          key={product.productId}
          title={`${product.title} - ${product.localizedPrice}`}
          onPress={() => subscribe(product.productId)}
        />
      ))}
    </View>
  );
};
```

**Backend Integration Required:**
- `POST /api/subscriptions/verify-purchase` - Verify receipt with Apple/Google
- `POST /api/subscriptions/restore` - Restore previous subscriptions
- `GET /api/subscriptions/status` - Get current subscription status
- Webhooks for subscription events (renewal, cancellation, etc.)

---

### Stripe Payment Integration Module

**Backend Service (`paddle-api/src/services/stripe.service.ts`):**
Complete Stripe integration for subscription management:

**Features:**
- Stripe API v2023-10-16 integration
- Customer creation and management
- Subscription lifecycle (create, update, cancel)
- Payment method handling
- Checkout Session creation
- Customer Portal for self-service
- Webhook handling for automated sync
- Trial period support (14 days)
- Prorated upgrades/downgrades

**Core Methods:**
- `createCustomer(userId, email, name)` - Create Stripe customer
- `createSubscription(data)` - Create new subscription with trial
- `cancelSubscription(subscriptionId, immediate)` - Cancel subscription
- `updateSubscription(subscriptionId, newPriceId)` - Upgrade/downgrade
- `createCheckoutSession(userId, priceId, urls)` - Create Checkout Session
- `createCustomerPortal(customerId, returnUrl)` - Self-service portal
- `handleWebhook(payload, signature)` - Process Stripe webhooks
- `getPrices()` - Fetch available subscription prices

**Webhook Events Handled:**
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.paid` - Payment successful
- `invoice.payment_failed` - Payment failed

**Routes (`paddle-api/src/routes/subscription.routes.ts`):**

All routes require authentication (except webhook):

```typescript
POST   /api/subscriptions/create              // Create subscription
POST   /api/subscriptions/cancel              // Cancel subscription
PUT    /api/subscriptions/update              // Update subscription
GET    /api/subscriptions/status              // Get user subscription status
POST   /api/subscriptions/checkout-session    // Create Checkout Session
POST   /api/subscriptions/portal              // Open Customer Portal
GET    /api/subscriptions/prices              // Get available prices
POST   /api/subscriptions/webhook             // Stripe webhook (no auth)
```

**Frontend Service (`paddle-app/src/services/stripe.service.ts`):**
React Native Stripe integration using `@stripe/stripe-react-native`:

**Methods:**
- `initializePaymentSheet(priceId, trialDays)` - Init payment UI
- `presentPaymentSheet()` - Show payment sheet to user
- `subscribe(priceId, trialDays)` - Complete subscription flow
- `getPrices()` - Fetch subscription prices
- `cancelSubscription(subscriptionId, immediate)` - Cancel subscription
- `createCheckoutSession(priceId, urls)` - Web checkout (if needed)
- `openCustomerPortal(returnUrl)` - Self-service management
- `updateSubscription(subscriptionId, newPriceId)` - Change plan

**Subscription Screen (`paddle-app/src/screens/subscription/SubscriptionScreen.tsx`):**
Beautiful subscription selection UI with:

**Features:**
- 2 subscription plans (Standard 9.99€, Premium 14.99€)
- Visual plan comparison with feature lists
- "Popular" badge for recommended plan
- 14-day free trial prominently displayed
- Stripe Payment Sheet integration
- Loading states during payment
- Current plan indication
- Responsive design with brand colors
- Success/error handling with alerts

**Plan Features Displayed:**

Standard (9.99€/mois):
- ✅ Réservation de terrains
- ✅ Recherche illimitée
- ✅ Statistiques avancées
- ✅ Organisation de matchs
- ✅ Chat
- ✅ Sans publicité

Premium (14.99€/mois):
- ✅ Everything in Standard
- ✅ Analyse vidéo
- ✅ Coaching IA
- ✅ Accès prioritaire tournois
- ✅ Badge Premium
- ✅ Stats comparatives
- ✅ Calendrier intelligent
- ✅ Matching IA

**Configuration Required:**

Backend `.env`:
```env
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_STANDARD_MONTHLY_PRICE_ID=price_xxx
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_xxx
```

Frontend `.env`:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_STANDARD_MONTHLY_PRICE_ID=price_xxx
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
```

**Setup Instructions:**

1. **Create Stripe Account** and get API keys
2. **Create Products** in Stripe Dashboard:
   - Standard Monthly (9.99€)
   - Premium Monthly (14.99€)
   - Premium Annual (99.99€)
3. **Copy Price IDs** to environment variables
4. **Configure Webhooks** in Stripe Dashboard:
   - Endpoint: `https://your-api.com/api/subscriptions/webhook`
   - Events: All subscription and invoice events
5. **Add Stripe field to Prisma User model:**
   ```prisma
   model User {
     // ... existing fields
     stripeCustomerId  String?  @unique
   }
   ```
6. **Install dependencies:**
   ```bash
   # Backend
   npm install stripe

   # Frontend
   npm install @stripe/stripe-react-native
   ```

**Usage Example:**

```typescript
import { SubscriptionScreen } from '@/screens/subscription/SubscriptionScreen';
import { StripeProvider } from '@stripe/stripe-react-native';

// In your navigation
<Stack.Screen
  name="Subscription"
  component={SubscriptionScreen}
/>

// User clicks subscribe → Payment Sheet appears → Trial starts
// After 14 days → Stripe auto-charges → Webhook updates DB
```

**Payment Flow:**
1. User selects plan
2. App calls `subscribe(priceId, 14)`
3. Backend creates subscription with trial
4. Frontend shows Stripe Payment Sheet
5. User enters card (saved for future charges)
6. Trial starts immediately (no charge)
7. After 14 days, Stripe auto-charges
8. Webhook updates user tier in database
9. App refreshes subscription status

**Security:**
- Card info never touches our servers (PCI compliance)
- Stripe handles all payment processing
- Webhook signatures verified
- Customer IDs linked to user IDs
- All routes protected (except webhook)

---

### Firebase Push Notifications Module

**Backend Service (`paddle-api/src/services/notification.service.ts`):**
Complete Firebase Cloud Messaging (FCM) integration for push notifications:

**Features:**
- Firebase Admin SDK integration
- Device token management
- Multi-platform support (iOS/Android)
- Targeted notifications (single user or bulk)
- Notification templates for common events
- Automatic token cleanup (invalid tokens)
- Custom notification data payloads
- Badge count management
- Priority and TTL settings

**Core Methods:**
- `initializeFirebase()` - Initialize Firebase Admin SDK
- `registerDeviceToken(userId, token, platform)` - Register device for notifications
- `unregisterDeviceToken(token)` - Remove device token
- `sendToUser(userId, notification, options)` - Send to specific user
- `sendToUsers(userIds, notification, options)` - Bulk send to multiple users
- `sendNewMessageNotification(recipientId, senderName, preview)` - Chat notification
- `sendMatchInvitationNotification(recipientId, matchTitle, organizer, matchId)` - Match invite
- `sendMatchReminderNotification(userId, matchTitle, time, matchId)` - Match reminder
- `sendBookingConfirmationNotification(userId, courtName, dateTime, bookingId)` - Booking confirmed
- `sendBookingCancellationNotification(userId, courtName, dateTime)` - Booking cancelled
- `sendTrialEndingNotification(userId, daysRemaining)` - Trial ending soon
- `sendPaymentSuccessNotification(userId, amount, planName)` - Payment successful
- `sendPaymentFailureNotification(userId, planName)` - Payment failed

**Routes (`paddle-api/src/routes/notification.routes.ts`):**

All routes require authentication:

```typescript
POST   /api/notifications/register-token     // Register device token
POST   /api/notifications/unregister-token   // Remove device token
POST   /api/notifications/send               // Send custom notification
POST   /api/notifications/send-bulk          // Send to multiple users
POST   /api/notifications/test               // Send test notification
```

**Prisma Schema Updates:**

Added `DeviceToken` model for token management:
```prisma
model DeviceToken {
  id         String   @id @default(uuid())
  userId     String
  token      String   @unique
  platform   Platform // ios or android
  lastUsedAt DateTime @default(now())
  createdAt  DateTime @default(now())

  @@index([userId])
  @@map("device_tokens")
}

enum Platform {
  ios
  android
}
```

**Frontend Service (`paddle-app/src/services/notification.service.ts`):**
React Native FCM integration using `@react-native-firebase/messaging` and `@notifee/react-native`:

**Methods:**
- `initialize()` - Setup FCM, request permissions, register token
- `requestPermission()` - Request notification permission (iOS/Android 13+)
- `checkPermission()` - Check if permissions granted
- `registerTokenOnBackend(token)` - Save token to backend
- `createNotificationChannel()` - Setup Android notification channels
- `setupListeners()` - Handle foreground/background/click events
- `displayNotification(message)` - Show local notification
- `handleNotificationClick(notification)` - Navigate on tap
- `disable()` - Unregister and delete token
- `sendTestNotification()` - Test notification delivery
- `getBadgeCount()` - Get current badge count (iOS)
- `setBadgeCount(count)` - Set badge count (iOS)
- `clearAllNotifications()` - Clear all notifications

**Hook (`paddle-app/src/hooks/useNotifications.ts`):**
React hook for easy notification management in components:

**Returns:**
```typescript
{
  // State
  isInitialized: boolean,        // Service initialized
  hasPermission: boolean,         // Permission granted
  notificationsEnabled: boolean,  // Redux enabled state
  loading: boolean,               // Operation in progress
  badgeCount: number,             // Current badge count

  // Methods
  checkPermission: () => Promise<boolean>,
  requestPermission: () => Promise<boolean>,
  enable: () => Promise<boolean>,
  disable: () => Promise<boolean>,
  toggle: () => Promise<boolean>,
  sendTestNotification: () => Promise<boolean>,
  updateBadgeCount: () => Promise<void>,
  setNotificationBadge: (count: number) => Promise<void>,
  clearAll: () => Promise<void>,
}
```

**Usage Example:**

```typescript
import { useNotifications } from '@/hooks/useNotifications';

function SettingsScreen() {
  const {
    notificationsEnabled,
    hasPermission,
    enable,
    disable,
    sendTestNotification,
  } = useNotifications();

  const handleToggle = async () => {
    if (notificationsEnabled) {
      await disable();
    } else {
      await enable();
    }
  };

  const handleTest = async () => {
    const success = await sendTestNotification();
    if (success) {
      Alert.alert('Success', 'Test notification sent!');
    }
  };

  return (
    <View>
      <Switch value={notificationsEnabled} onValueChange={handleToggle} />
      <Button title="Send Test" onPress={handleTest} />
    </View>
  );
}
```

**Notification Channels (Android):**
- **default**: General notifications
- **matches**: Match invitations and reminders
- **messages**: Chat messages
- **bookings**: Booking confirmations and cancellations

All channels use `HIGH` importance and default sound.

**Configuration Required:**

Backend `.env`:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Frontend Firebase setup:
1. **iOS**: Add `GoogleService-Info.plist` to `ios/` folder
2. **Android**: Add `google-services.json` to `android/app/` folder
3. **Install dependencies:**
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/messaging
   npm install @notifee/react-native
   cd ios && pod install
   ```

**Initialization in App.tsx:**

```typescript
import { NotificationService } from '@/services/notification.service';

useEffect(() => {
  // Initialize notifications on app start
  NotificationService.initialize();
}, []);
```

**Backend Initialization (index.ts):**

```typescript
import { initializeFirebase } from './services/notification.service';

// Initialize Firebase Admin at server startup
initializeFirebase();
```

**Notification Flow:**

1. **User enables notifications** → Request permission
2. **Permission granted** → Get FCM token
3. **Token obtained** → Register on backend
4. **Backend event occurs** (new message, match invite, etc.)
5. **Backend sends via FCM** → User's device(s) receive
6. **App foreground** → Display local notification
7. **App background** → System displays notification
8. **User taps notification** → Navigate to relevant screen
9. **Token refresh** → Update backend automatically
10. **Invalid tokens** → Automatically cleaned from database

**Notification Types:**
- `new_message` → Navigate to chat
- `match_invitation` → Navigate to match details
- `match_reminder` → Navigate to match details
- `booking_confirmed` → Navigate to booking details
- `booking_cancelled` → Navigate to bookings list
- `trial_ending` → Navigate to subscription screen
- `payment_success` → Show success message
- `payment_failed` → Navigate to payment method
- `test` → Show test confirmation

**Security:**
- Device tokens are user-specific
- Tokens expire and refresh automatically
- Invalid tokens cleaned up
- All API routes require authentication
- Firebase signature verification on backend

**Best Practices:**
1. Request permission at appropriate time (not immediately on app launch)
2. Explain value of notifications before requesting
3. Handle permission denial gracefully
4. Test on both iOS and Android
5. Monitor Firebase Console for delivery rates
6. Keep notification messages concise and actionable
7. Use rich notifications with images when appropriate
8. Set badge counts appropriately (iOS)
9. Clear notifications when user views content
10. Respect user preferences (mute settings)

---

### Real-time Chat Module (Socket.io)

**Backend Configuration (`paddle-api/src/config/socket.config.ts`):**
Complete Socket.io server setup with JWT authentication and real-time event handling:

**Features:**
- Socket.io server initialization with CORS support
- JWT-based authentication middleware
- User socket mapping for online status tracking
- Room-based messaging (conversations and matches)
- Automatic offline participant notifications
- Connection/disconnection handling
- Last active timestamp updates

**Socket Events:**
- `join_conversation` - Join a conversation room
- `leave_conversation` - Leave a conversation room
- `send_message` - Send a message in real-time
- `mark_as_read` - Mark messages as read
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `join_match_chat` - Join match-specific chat
- `send_match_message` - Send message in match chat

**Emitted Events:**
- `new_message` - New message received
- `user_typing` - User is typing
- `user_stopped_typing` - User stopped typing
- `messages_read` - Messages marked as read
- `new_match_message` - New match chat message
- `message_error` - Error sending message

**Backend Service (`paddle-api/src/services/chat.service.ts`):**
Complete chat management via REST API for history and conversation management:

**Features:**
- Direct and group conversation management
- Message pagination and history
- Unread count tracking
- Conversation search
- Mute/unmute conversations
- Message formatting with participant details
- Socket.io integration for real-time updates

**Core Methods:**
- `getOrCreateDirectConversation(userId, otherUserId)` - Get or create 1-on-1 chat
- `createConversation(data)` - Create new conversation (direct/group)
- `getUserConversations(userId)` - List all user conversations
- `getConversationById(conversationId, userId)` - Get conversation details
- `getConversationMessages(conversationId, userId, options)` - Load message history
- `sendMessage(userId, data)` - Send message via REST (fallback)
- `markMessagesAsRead(userId, conversationId)` - Mark as read
- `getUnreadCount(userId)` - Get total unread messages
- `deleteConversation(userId, conversationId)` - Delete for user
- `muteConversation(userId, conversationId, mutedUntil)` - Mute notifications
- `searchConversations(userId, query)` - Search conversations

**Routes (`paddle-api/src/routes/chat.routes.ts`):**

All routes require authentication:

```typescript
GET    /api/chat/conversations              // List all conversations
GET    /api/chat/conversations/:id          // Get conversation details
POST   /api/chat/conversations              // Create new conversation
POST   /api/chat/conversations/direct       // Create/get direct conversation
GET    /api/chat/conversations/:id/messages // Get message history
POST   /api/chat/messages                   // Send message (REST fallback)
PUT    /api/chat/conversations/:id/read     // Mark messages as read
GET    /api/chat/unread-count               // Get total unread count
DELETE /api/chat/conversations/:id          // Delete conversation
PUT    /api/chat/conversations/:id/mute     // Mute/unmute conversation
GET    /api/chat/search                     // Search conversations
```

**Frontend Service (`paddle-app/src/services/chat.service.ts`):**
Socket.io client for React Native with real-time messaging:

**Methods:**
- `initialize()` - Connect to Socket.io server with JWT
- `disconnect()` - Disconnect from server
- `joinConversation(conversationId)` - Join conversation room
- `leaveConversation(conversationId)` - Leave conversation room
- `sendMessage(data)` - Send message via Socket.io
- `markAsRead(conversationId)` - Mark as read
- `startTyping(conversationId)` - Show typing indicator
- `stopTyping(conversationId)` - Hide typing indicator
- `getConversations()` - Fetch all conversations (REST)
- `getConversation(conversationId)` - Get conversation details (REST)
- `getOrCreateDirectConversation(userId)` - Direct chat (REST)
- `createGroupConversation(participantIds, name, avatarUrl)` - Group chat (REST)
- `getMessages(conversationId, options)` - Load message history (REST)
- `getUnreadCount()` - Get total unread count (REST)
- `deleteConversation(conversationId)` - Delete conversation (REST)
- `muteConversation(conversationId, mutedUntil)` - Mute/unmute (REST)
- `searchConversations(query)` - Search (REST)

**Event Handlers:**
- `onNewMessage(handler)` - Subscribe to new messages
- `onTypingStart(handler)` - Subscribe to typing indicators
- `onTypingStop(handler)` - Subscribe to typing stop
- `onMessagesRead(handler)` - Subscribe to read receipts
- `onError(handler)` - Subscribe to errors

**Hook (`paddle-app/src/hooks/useChat.ts`):**
React hook for easy chat integration in components:

**Returns:**
```typescript
{
  // State
  conversations: Conversation[],
  currentConversation: Conversation | null,
  messages: Message[],
  unreadCount: number,
  loading: boolean,
  error: string | null,
  isTyping: Record<string, boolean>,  // userId -> isTyping
  isConnected: boolean,

  // Methods
  loadConversations: () => Promise<void>,
  loadConversation: (conversationId: string) => Promise<void>,
  loadMessages: (conversationId: string, options?) => Promise<void>,
  loadMoreMessages: (conversationId: string) => Promise<void>,
  getOrCreateDirectConversation: (userId: string) => Promise<Conversation | null>,
  createGroupConversation: (participantIds[], name, avatarUrl?) => Promise<Conversation | null>,
  sendMessage: (data: SendMessageData) => void,
  markAsRead: (conversationId: string) => void,
  startTyping: (conversationId: string) => void,
  stopTyping: (conversationId: string) => void,
  deleteConversation: (conversationId: string) => Promise<void>,
  muteConversation: (conversationId: string, mutedUntil: Date | null) => Promise<void>,
  updateUnreadCount: () => Promise<void>,
}
```

**Usage Example:**

```typescript
import { useChat } from '@/hooks/useChat';

function ChatScreen({ route }) {
  const conversationId = route.params.conversationId;
  const {
    messages,
    currentConversation,
    isTyping,
    loading,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
  } = useChat(conversationId);

  const handleSend = (text: string) => {
    sendMessage({
      conversationId,
      content: text,
      type: 'TEXT',
    });
  };

  const handleTyping = () => {
    startTyping(conversationId);
  };

  useEffect(() => {
    // Mark as read when viewing conversation
    markAsRead(conversationId);
  }, [conversationId]);

  return (
    <View>
      <MessageList messages={messages} />
      {isTyping[otherUserId] && <TypingIndicator />}
      <MessageInput onSend={handleSend} onTyping={handleTyping} />
    </View>
  );
}
```

**Configuration Required:**

Backend `.env`:
```env
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000  # For CORS
```

Frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:3000  # Socket.io server URL
```

**Setup Instructions:**

1. **Install Socket.io dependencies:**
   ```bash
   # Backend
   npm install socket.io

   # Frontend
   npm install socket.io-client
   ```

2. **Initialize Socket.io server:**
   ```typescript
   // paddle-api/src/index.ts
   import { createServer } from 'http';
   import { SocketService } from './config/socket.config';

   const httpServer = createServer(app);
   SocketService.initialize(httpServer);

   httpServer.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

3. **Initialize Socket.io client:**
   ```typescript
   // paddle-app/App.tsx
   import { ChatService } from '@/services/chat.service';

   useEffect(() => {
     // Initialize chat when user is authenticated
     if (isAuthenticated) {
       ChatService.initialize();
     }

     return () => {
       ChatService.disconnect();
     };
   }, [isAuthenticated]);
   ```

**Message Flow:**

1. **User sends message** → `sendMessage()` called
2. **Socket.io emits** → `send_message` event to server
3. **Server validates** → Check authentication and participation
4. **Message saved** → Created in database via Prisma
5. **Server emits** → `new_message` to all conversation participants
6. **Clients receive** → Update local message list
7. **Offline users** → Receive push notification via FCM
8. **Read receipts** → Automatically sent when viewing conversation
9. **Typing indicators** → Shown with 3s auto-timeout
10. **Unread count** → Updated in real-time for all clients

**Features:**

✅ **Real-time Messaging:**
- Instant message delivery via WebSocket
- Fallback to REST API if Socket.io unavailable
- Automatic reconnection with exponential backoff
- Message queuing during reconnection

✅ **Conversation Types:**
- Direct 1-on-1 conversations
- Group conversations with multiple participants
- Match-specific chat rooms

✅ **Advanced Features:**
- Typing indicators with auto-timeout
- Read receipts and message status
- Message pagination for history
- Unread count tracking
- Online/offline status
- Conversation muting
- Message search

✅ **Offline Support:**
- Push notifications for offline users
- Message persistence in database
- Automatic sync on reconnection
- REST API fallback

**Security:**
- JWT authentication for Socket.io connections
- User participation verification
- Room-based access control
- Message sender validation
- CORS protection

**Best Practices:**
1. Always disconnect Socket.io on logout
2. Join conversation rooms when viewing
3. Leave rooms when navigating away
4. Mark messages as read when viewing
5. Handle reconnection gracefully
6. Use typing indicators sparingly (auto-timeout)
7. Paginate messages for long conversations
8. Clear unread counts when viewing
9. Test with poor network conditions
10. Monitor Socket.io connection status

---

### Geolocation & Maps Module

**Frontend Geolocation Service (`paddle-app/src/services/geolocation.service.ts`):**
Complete location tracking and distance calculation service:

**Features:**
- Location permissions handling (iOS & Android)
- Current position retrieval with high accuracy
- Position watching with configurable distance filter
- Haversine distance calculations
- Distance formatting for display
- Radius-based filtering
- Location sorting by distance
- Region calculation for map bounds
- Settings deep linking

**Core Methods:**
- `requestPermission()` - Request location permission (platform-specific)
- `checkPermission()` - Check if permission granted
- `getCurrentPosition(options?)` - Get current location once
- `getLastKnownPosition()` - Get cached location
- `watchPosition(onSuccess, onError, options?)` - Continuous tracking
- `clearWatch(watchId?)` - Stop position watching
- `calculateDistance(point1, point2)` - Haversine distance in km
- `formatDistance(distanceKm)` - Format for display (m/km)
- `isWithinRadius(center, point, radiusKm)` - Check if in range
- `sortByDistance(userLocation, items)` - Sort array by distance
- `filterByRadius(userLocation, items, radiusKm)` - Filter by range
- `getCenterPoint(locations)` - Calculate geographic center
- `getRegionForCoordinates(locations, padding?)` - Map region bounds
- `openLocationSettings()` - Deep link to settings

**Hook (`paddle-app/src/hooks/useGeolocation.ts`):**
React hook for easy location management in components:

**Returns:**
```typescript
{
  // State
  location: LocationWithAccuracy | null,
  hasPermission: boolean,
  loading: boolean,
  error: string | null,
  isReady: boolean,  // hasPermission && location !== null

  // Permission methods
  checkPermission: () => Promise<boolean>,
  requestPermission: () => Promise<boolean>,
  openSettings: () => Promise<void>,

  // Position methods
  getCurrentPosition: () => Promise<LocationWithAccuracy | null>,
  refresh: () => Promise<LocationWithAccuracy | null>,
  startWatchingPosition: () => void,
  stopWatchingPosition: () => void,

  // Distance utilities
  getDistanceTo: (targetLocation: Location) => number | null,
  formatDistance: (targetLocation: Location) => string | null,
  isWithinRadius: (targetLocation: Location, radiusKm: number) => boolean,
  sortByDistance: <T>(items: T[]) => T[],
  filterByRadius: <T>(items: T[], radiusKm: number) => T[],
}
```

**Map Components:**

**MapView (`paddle-app/src/components/map/MapView.tsx`):**
Base map component using react-native-maps with Google Maps provider:

**Props:**
```typescript
{
  initialRegion?: Region,
  markers?: MapMarker[],
  onMarkerPress?: (marker: MapMarker) => void,
  onMapPress?: (coordinate: LatLng) => void,
  onRegionChange?: (region: Region) => void,
  showUserLocation?: boolean,
  showRadius?: boolean,
  radiusKm?: number,
  radiusCenter?: LatLng,
  followUserLocation?: boolean,
  style?: any,
}
```

**Features:**
- Google Maps integration
- Custom markers with types (court, player, club, match)
- Search radius visualization with circle overlay
- User location display
- Camera animation
- Automatic fit to markers
- Touch event handling

**CourtMapView (`paddle-app/src/components/map/CourtMapView.tsx`):**
Specialized map for displaying courts:

**Props:**
```typescript
{
  courts: Court[],
  onCourtPress?: (court: Court) => void,
  showRadius?: boolean,
  radiusKm?: number,
  autoFitMarkers?: boolean,
  style?: any,
}
```

**Features:**
- Automatic court marker generation
- Color coding (Indoor: blue, Outdoor: green)
- Auto-fit to show all courts
- Distance-based sorting
- Cluster support for many courts

**Backend Location Service (`paddle-api/src/services/location.service.ts`):**
Geographic search and matching service with optimized queries:

**Core Methods:**
- `calculateDistance(lat1, lon1, lat2, lon2)` - Haversine formula
- `getBoundingBox(lat, lon, radiusKm)` - Optimize DB queries
- `findNearbyPlayers(query, options?)` - Search players by location
- `findNearbyClubs(query, options?)` - Search clubs by location
- `findNearbyCourts(query, options?)` - Search courts by location
- `findNearbyMatches(query, options?)` - Search matches by location
- `updateUserLocation(userId, lat, lon, location?)` - Update position
- `getLocationStats(lat, lon, radiusKm)` - Geographic statistics

**Search Features:**
- **Bounding box optimization:** Pre-filter with lat/lng ranges before distance calc
- **Skill level filtering:** Match players by skill
- **Court type filtering:** Indoor vs Outdoor
- **Availability filtering:** Only show available courts/clubs
- **Participant exclusion:** Don't show matches user already joined
- **Distance sorting:** Results ordered by proximity
- **Configurable radius:** 0.1km to 100km range

**Routes (`paddle-api/src/routes/location.routes.ts`):**

```typescript
GET    /api/location/players/nearby   // Find players (Private)
GET    /api/location/clubs/nearby     // Find clubs (Public)
GET    /api/location/courts/nearby    // Find courts (Public)
GET    /api/location/matches/nearby   // Find matches (Private)
PUT    /api/location/update           // Update user location (Private)
GET    /api/location/stats            // Get location stats (Private)
```

**Query Parameters:**
- `latitude` (required) - User latitude
- `longitude` (required) - User longitude
- `radiusKm` (optional) - Search radius, default 10km
- `skillLevel` (optional) - Filter by skill level
- `type` (optional) - Court type (INDOOR/OUTDOOR)
- `limit` (optional) - Max results, default 50

**Usage Example:**

```typescript
import { useGeolocation } from '@/hooks/useGeolocation';
import { CourtMapView } from '@/components/map/CourtMapView';

function CourtsMapScreen() {
  const {
    location,
    hasPermission,
    loading,
    requestPermission,
    sortByDistance,
  } = useGeolocation({ watchPosition: true });

  const [courts, setCourts] = useState([]);

  useEffect(() => {
    if (hasPermission && location) {
      searchNearbyCourts();
    }
  }, [location, hasPermission]);

  const searchNearbyCourts = async () => {
    const response = await axios.get('/location/courts/nearby', {
      params: {
        latitude: location!.latitude,
        longitude: location!.longitude,
        radiusKm: 10,
        type: 'INDOOR',
      },
    });

    // Courts are already sorted by distance from backend
    setCourts(response.data.courts);
  };

  const handleCourtPress = (court) => {
    navigation.navigate('CourtDetails', { courtId: court.id });
  };

  if (!hasPermission) {
    return (
      <View>
        <Text>Permission de localisation requise</Text>
        <Button title="Autoriser" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <CourtMapView
      courts={courts}
      onCourtPress={handleCourtPress}
      showRadius={true}
      radiusKm={10}
      autoFitMarkers={true}
    />
  );
}
```

**Configuration Required:**

Frontend dependencies:
```bash
npm install react-native-maps
npm install @react-native-community/geolocation

# iOS: Add to Podfile
pod 'react-native-google-maps', :path => '../node_modules/react-native-maps'

# iOS: Add to Info.plist
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to find nearby courts and players</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need your location to find nearby courts and players</string>

# Android: Add to AndroidManifest.xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

# Android: Add Google Maps API key
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
```

**Performance Optimizations:**

1. **Bounding Box Pre-filtering:**
   ```typescript
   // Instead of calculating distance for ALL records:
   // ❌ SELECT * FROM users
   //    WHERE distance(lat, lng, userLat, userLng) < 10

   // Use bounding box first (uses lat/lng indexes):
   // ✅ SELECT * FROM users
   //    WHERE lat BETWEEN minLat AND maxLat
   //    AND lng BETWEEN minLng AND maxLng
   //    THEN calculate exact distance
   ```

2. **Database Indexing:**
   - Add indexes on `latitude` and `longitude` columns
   - Composite index: `(latitude, longitude)` for best performance

3. **Distance Caching:**
   - Cache calculated distances to avoid recalculation
   - Use `getLastKnownPosition()` when accuracy isn't critical

4. **Position Watch Tuning:**
   - Set `distanceFilter` to avoid excessive updates (10m recommended)
   - Use `interval` to limit update frequency

**Best Practices:**

1. Request permission at appropriate time (not on app launch)
2. Explain why location is needed before requesting
3. Handle permission denial gracefully
4. Cache last known position
5. Use bounding box for large datasets
6. Set reasonable radius limits (100km max)
7. Add database indexes for lat/lng
8. Test with various locations and densities
9. Consider battery impact of continuous tracking
10. Provide manual location input as fallback

**Distance Calculation:**

Uses Haversine formula for accurate great-circle distance:
```typescript
// Accuracy: ±0.3% for typical distances
// Performance: ~0.001ms per calculation
// Range: Works globally, any two points on Earth
```

**Limitations:**
- Assumes spherical Earth (good enough for < 1000km)
- Doesn't account for terrain or roads
- Not suitable for navigation routing
- For routing, use Google Maps Directions API

---

### Complete Match Management Module

**Backend Service (`paddle-api/src/services/match.service.ts`):**
Comprehensive match management with scoring, statistics, and intelligent recommendations:

**Features:**
- Full match lifecycle management (create, update, start, complete, cancel)
- Advanced search with multiple filters
- Real-time scoring system with set tracking
- Automatic player statistics updates
- Smart match recommendations based on multiple factors
- Match history with pagination
- Geographic search integration
- ELO rating system
- Team management for doubles matches

**Core Methods:**

**Match CRUD:**
- `createMatch(data)` - Create new match with automatic organizer enrollment
- `getMatchById(matchId, userId?)` - Get match details with participant status
- `updateMatch(matchId, userId, data)` - Update match (organizer only)
- `searchMatches(filters)` - Advanced search with filters and pagination

**Participant Management:**
- `joinMatch(matchId, userId, team?)` - Join a match with team selection
- `leaveMatch(matchId, userId)` - Leave a match (except organizer)

**Match Lifecycle:**
- `startMatch(matchId, userId)` - Start a scheduled match
- `addSetScore(matchId, userId, score)` - Add score for a set
- `completeMatch(matchId, userId, data)` - Complete match with final scores
- `cancelMatch(matchId, userId)` - Cancel a match

**Analytics & Recommendations:**
- `getUserMatchHistory(userId, filters?)` - Get user's match history
- `getMatchRecommendations(userId, limit?)` - Smart match suggestions

**Search Filters (`MatchFilters`):**
```typescript
{
  type?: 'FRIENDLY' | 'RANKED' | 'TRAINING' | 'TOURNAMENT' | 'DISCOVERY',
  format?: 'SINGLES' | 'DOUBLES',
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  skillLevel?: SkillLevel,
  city?: string,
  latitude?: number,
  longitude?: number,
  radiusKm?: number,
  startDate?: Date,
  endDate?: Date,
  organizerId?: string,
  hasSpots?: boolean,
  page?: number,
  limit?: number,
}
```

**Scoring System:**
- Set-by-set score tracking
- Automatic winner determination
- Team scores (1-7 points per set)
- Support for 1-5 sets

**Statistics Auto-Update:**
When a match is completed, automatically updates for all participants:
- Total matches played
- Matches won/lost
- Win rate percentage
- Current win streak
- Longest win streak
- Total play time
- ELO score (K-factor 32)

**Smart Recommendations Algorithm:**
Matches are scored 0-100 based on:

1. **Skill Level (40 points):**
   - Perfect match: 40 points
   - One level difference: 30 points
   - Two levels difference: 15 points

2. **Distance (30 points):**
   - ≤ 5km: 30 points
   - ≤ 10km: 20 points
   - ≤ 20km: 10 points

3. **Timing (15 points):**
   - 24-72 hours ahead: 15 points (ideal)
   - 12-168 hours ahead: 10 points

4. **Available Spots (10 points):**
   - ≥ 2 spots: 10 points
   - 1 spot: 5 points

5. **Match Type (5 points):**
   - FRIENDLY: 5 points
   - RANKED for experienced players: 5 points

Minimum recommendation score: 30

**Routes (`paddle-api/src/routes/match.routes.ts`):**

14 API endpoints for complete match management:

```typescript
POST   /api/matches                      // Create match (Private)
GET    /api/matches/search               // Search matches (Public)
GET    /api/matches/:id                  // Get match details (Public)
PUT    /api/matches/:id                  // Update match (Private, organizer)
POST   /api/matches/:id/join             // Join match (Private)
POST   /api/matches/:id/leave            // Leave match (Private)
POST   /api/matches/:id/start            // Start match (Private, organizer)
POST   /api/matches/:id/score            // Add set score (Private, organizer)
POST   /api/matches/:id/complete         // Complete match (Private, organizer)
POST   /api/matches/:id/cancel           // Cancel match (Private, organizer)
GET    /api/matches/user/history         // Get match history (Private)
GET    /api/matches/user/recommendations // Get recommendations (Private)
```

**Request/Response Examples:**

**Create Match:**
```typescript
POST /api/matches
{
  type: 'FRIENDLY',
  format: 'DOUBLES',
  courtId: 'court-123',
  scheduledAt: '2025-11-18T14:00:00Z',
  duration: 90,
  requiredLevel: 'INTERMEDIATE',
  maxParticipants: 4,
  description: 'Friendly doubles match',
  visibility: 'PUBLIC'
}
```

**Search Matches:**
```typescript
GET /api/matches/search?latitude=48.8566&longitude=2.3522&radiusKm=10&skillLevel=INTERMEDIATE&hasSpots=true&page=1&limit=20

Response: {
  success: true,
  matches: [/* array of matches */],
  pagination: {
    page: 1,
    limit: 20,
    total: 45,
    totalPages: 3
  }
}
```

**Add Set Score:**
```typescript
POST /api/matches/:id/score
{
  team1Score: 6,
  team2Score: 4,
  setNumber: 1
}
```

**Complete Match:**
```typescript
POST /api/matches/:id/complete
{
  winnerId: 'user-123',
  scores: [
    { team1Score: 6, team2Score: 4, setNumber: 1 },
    { team1Score: 6, team2Score: 3, setNumber: 2 }
  ]
}
```

**Frontend Hook (`paddle-app/src/hooks/useMatch.ts`):**
React hook for comprehensive match management:

**State:**
- `matches` - Current search results
- `currentMatch` - Selected match details
- `recommendations` - Match recommendations
- `history` - User's match history
- `loading` - Loading state
- `error` - Error message
- `pagination` - Pagination info

**Methods:**

**Match Operations:**
- `createMatch(data)` - Create new match
- `getMatchById(matchId)` - Load match details
- `updateMatch(matchId, data)` - Update match
- `joinMatch(matchId, team?)` - Join with team selection
- `leaveMatch(matchId)` - Leave match
- `searchMatches(filters?)` - Search with filters
- `loadMore(filters?)` - Load next page

**Match Lifecycle:**
- `startMatch(matchId)` - Start the match
- `addSetScore(matchId, score)` - Add set score
- `completeMatch(matchId, winnerId?, scores?)` - Complete match
- `cancelMatch(matchId)` - Cancel match

**Analytics:**
- `getUserMatchHistory(filters?)` - Load history with filters
- `getMatchRecommendations(limit?)` - Get smart recommendations

**Utilities:**
- `reset()` - Reset all state

**Usage Example:**

```typescript
import { useMatch } from '@/hooks/useMatch';

function MatchScreen() {
  const {
    matches,
    currentMatch,
    recommendations,
    loading,
    error,
    createMatch,
    searchMatches,
    joinMatch,
    getMatchRecommendations,
  } = useMatch();

  useEffect(() => {
    // Load nearby matches
    searchMatches({
      latitude: 48.8566,
      longitude: 2.3522,
      radiusKm: 10,
      skillLevel: 'INTERMEDIATE',
      hasSpots: true,
    });

    // Load recommendations
    getMatchRecommendations(10);
  }, []);

  const handleCreateMatch = async () => {
    try {
      const match = await createMatch({
        type: 'FRIENDLY',
        format: 'DOUBLES',
        courtId: 'court-123',
        scheduledAt: new Date('2025-11-18T14:00:00Z'),
        requiredLevel: 'INTERMEDIATE',
      });
      navigation.navigate('MatchDetails', { matchId: match.id });
    } catch (err) {
      console.error('Failed to create match:', err);
    }
  };

  const handleJoinMatch = async (matchId: string) => {
    const success = await joinMatch(matchId, 1); // Team 1
    if (success) {
      Alert.alert('Success', 'You joined the match!');
    }
  };

  return (
    <ScrollView>
      {/* Recommendations */}
      <Section title="Recommended for You">
        {recommendations.map((rec) => {
          const match = matches.find((m) => m.id === rec.matchId);
          return match ? (
            <MatchCard
              key={match.id}
              match={match}
              recommendationScore={rec.score}
              reasons={rec.reasons}
              onPress={() => navigation.navigate('MatchDetails', { matchId: match.id })}
              onJoinPress={() => handleJoinMatch(match.id)}
            />
          ) : null;
        })}
      </Section>

      {/* Search Results */}
      <Section title="Nearby Matches">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onPress={() => navigation.navigate('MatchDetails', { matchId: match.id })}
            onJoinPress={() => handleJoinMatch(match.id)}
          />
        ))}
      </Section>
    </ScrollView>
  );
}
```

**Scoring Flow Example:**

```typescript
import { useMatch } from '@/hooks/useMatch';

function MatchScoringScreen({ route }) {
  const { matchId } = route.params;
  const { currentMatch, startMatch, addSetScore, completeMatch } = useMatch();
  const [currentSet, setCurrentSet] = useState(1);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const handleStartMatch = async () => {
    await startMatch(matchId);
  };

  const handleAddSet = async () => {
    const success = await addSetScore(matchId, {
      team1Score,
      team2Score,
      setNumber: currentSet,
    });

    if (success) {
      setCurrentSet(currentSet + 1);
      setTeam1Score(0);
      setTeam2Score(0);
    }
  };

  const handleCompleteMatch = async (winnerId: string) => {
    await completeMatch(matchId, winnerId, currentMatch?.scores);
    navigation.goBack();
  };

  return (
    <View>
      {currentMatch?.status === 'SCHEDULED' && (
        <Button title="Start Match" onPress={handleStartMatch} />
      )}

      {currentMatch?.status === 'IN_PROGRESS' && (
        <>
          <Text>Set {currentSet}</Text>
          <ScoreInput
            label="Team 1"
            value={team1Score}
            onChangeValue={setTeam1Score}
          />
          <ScoreInput
            label="Team 2"
            value={team2Score}
            onChangeValue={setTeam2Score}
          />
          <Button title="Add Set" onPress={handleAddSet} />
          <Button
            title="Complete Match"
            onPress={() => handleCompleteMatch(determineWinner())}
          />
        </>
      )}
    </View>
  );
}
```

**Integration with Geolocation:**

```typescript
import { useMatch } from '@/hooks/useMatch';
import { useGeolocation } from '@/hooks/useGeolocation';

function NearbyMatchesScreen() {
  const { location } = useGeolocation();
  const { matches, searchMatches } = useMatch();

  useEffect(() => {
    if (location) {
      searchMatches({
        latitude: location.latitude,
        longitude: location.longitude,
        radiusKm: 15,
        skillLevel: userSkillLevel,
        hasSpots: true,
      });
    }
  }, [location]);

  return (
    <FlatList
      data={matches}
      renderItem={({ item }) => (
        <MatchCard
          match={item}
          distance={item.distance}
          onPress={() => handleMatchPress(item)}
        />
      )}
    />
  );
}
```

**Key Features:**

1. **Complete Match Lifecycle:**
   - Creation with validation
   - Participant management
   - Real-time status updates
   - Scoring system
   - Automatic statistics

2. **Smart Search:**
   - Multiple filter combinations
   - Geographic search integration
   - Available spots filtering
   - Skill level matching
   - Date range filtering

3. **Intelligent Recommendations:**
   - Multi-factor scoring algorithm
   - Personalized suggestions
   - Explanatory reasons
   - Configurable result count

4. **Robust Statistics:**
   - Automatic updates on match completion
   - Win/loss tracking
   - Streak calculations
   - ELO rating system
   - Play time accumulation

5. **Security & Validation:**
   - Organizer-only operations
   - Participant verification
   - Status-based permissions
   - Input validation
   - Error handling

**Best Practices:**

1. Always check match status before operations
2. Handle permission errors gracefully
3. Validate team assignments for doubles
4. Show clear match state to users
5. Provide feedback during async operations
6. Cache match data to reduce API calls
7. Use pagination for large result sets
8. Display recommendation reasons to users
9. Confirm destructive actions (cancel, leave)
10. Update local state after successful operations

---

### Complete Booking System Module

**Backend Service (`paddle-api/src/services/booking.service.ts`):**
Comprehensive court booking management with availability checking, payment integration, and statistics:

**Features:**
- Full booking lifecycle (create, update, confirm, cancel, complete)
- Real-time availability checking with conflict detection
- Automatic price calculation based on court hourly rates
- Time slot generation (90-minute intervals)
- Payment integration (Stripe ready)
- Cancellation policy enforcement (24-hour rule)
- Automatic refund handling
- Booking expiration cleanup (30-minute timeout)
- Auto-completion of past bookings
- User booking statistics and analytics

**Core Methods:**

**Booking CRUD:**
- `createBooking(data)` - Create new booking with availability check
- `getBookingById(bookingId, userId?)` - Get booking details with authorization
- `searchBookings(filters)` - Advanced search with filters and pagination
- `getUserBookings(userId, filters?)` - Get user's bookings with status filtering
- `updateBooking(bookingId, userId, data)` - Modify booking with availability recheck
- `confirmBooking(bookingId)` - Confirm booking after payment
- `cancelBooking(bookingId, userId, reason?)` - Cancel with refund policy check
- `completeBooking(bookingId)` - Mark booking as completed

**Availability Management:**
- `checkAvailability(courtId, startTime, endTime, excludeBookingId?)` - Check slot availability
- `getCourtDayAvailability(courtId, date)` - Get all time slots for a day
- Time slot generation with 90-minute intervals
- Conflict detection algorithm (checks overlapping bookings)
- Club opening hours integration

**Analytics & Utilities:**
- `getUserBookingStatistics(userId)` - Comprehensive user statistics
- `calculatePrice(pricePerHour, durationMinutes)` - Automatic pricing
- `cleanupExpiredBookings()` - Remove PENDING bookings after 30 minutes
- `autoCompleteBookings()` - Mark past bookings as COMPLETED

**Booking Filters:**
```typescript
{
  userId?: string,
  courtId?: string,
  clubId?: string,
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
  startDate?: Date,
  endDate?: Date,
  page?: number,
  limit?: number,
}
```

**Availability System:**
- **Time Slots:** 90-minute intervals (configurable)
- **Opening Hours:** Extracted from club.openingHours JSON
- **Conflict Detection:** 4 overlap scenarios checked:
  1. New booking starts during existing booking
  2. New booking ends during existing booking
  3. New booking completely contains existing booking
  4. New booking is completely inside existing booking

**Cancellation Policy:**
- **24+ hours before:** Full refund eligible
- **Less than 24 hours:** No refund
- **Status validation:** Cannot cancel CANCELLED or COMPLETED bookings
- **Automatic cleanup:** PENDING bookings auto-cancelled after 30 minutes

**Statistics Tracking:**
Per user statistics include:
- Total bookings count
- Upcoming bookings (PENDING/CONFIRMED in future)
- Completed bookings count
- Cancelled bookings count
- Total amount spent (paid bookings only)
- Favorite club (most bookings)
- Bookings by month (last 6 months with spend)

**Routes (`paddle-api/src/routes/booking.routes.ts`):**

13 REST API endpoints for complete booking management:

```typescript
POST   /api/bookings                       // Create booking (Private)
GET    /api/bookings                       // Search bookings (Private, admin)
GET    /api/bookings/user/me               // Get my bookings (Private)
GET    /api/bookings/user/upcoming         // Get upcoming bookings (Private)
GET    /api/bookings/user/statistics       // Get my statistics (Private)
GET    /api/bookings/:id                   // Get booking details (Private)
PUT    /api/bookings/:id                   // Update booking (Private)
POST   /api/bookings/:id/cancel            // Cancel booking (Private)
DELETE /api/bookings/:id                   // Delete/Cancel booking (Private)
POST   /api/bookings/:id/confirm           // Confirm booking (Private)
GET    /api/courts/:courtId/availability   // Get day availability (Public)
GET    /api/courts/:courtId/availability/week // Get week availability (Public)
POST   /api/bookings/check-availability    // Check specific slot (Public)
POST   /api/bookings/cleanup               // Cleanup expired (Cron/Admin)
```

**Request/Response Examples:**

**Create Booking:**
```typescript
POST /api/bookings
{
  courtId: 'court-123',
  startTime: '2025-11-18T14:00:00Z',
  endTime: '2025-11-18T15:30:00Z',
  duration: 90,
  paymentMethod: 'CARD',
  notes: 'Singles practice'
}
```

**Check Availability:**
```typescript
GET /api/courts/:courtId/availability?date=2025-11-18

Response: {
  success: true,
  availability: {
    date: '2025-11-18',
    courtId: 'court-123',
    court: {
      id: 'court-123',
      name: 'Court Central',
      type: 'INDOOR',
      pricePerHour: 25
    },
    slots: [
      {
        startTime: '2025-11-18T08:00:00Z',
        endTime: '2025-11-18T09:30:00Z',
        available: true,
        price: 37.50,
        bookingId: null
      },
      {
        startTime: '2025-11-18T09:30:00Z',
        endTime: '2025-11-18T11:00:00Z',
        available: false,
        price: 37.50,
        bookingId: 'booking-456'
      },
      // ... more slots
    ],
    openingHour: 8,
    closingHour: 22
  }
}
```

**Get Statistics:**
```typescript
GET /api/bookings/user/statistics

Response: {
  success: true,
  statistics: {
    totalBookings: 45,
    upcomingBookings: 3,
    completedBookings: 38,
    cancelledBookings: 4,
    totalSpent: 1125.50,
    favoriteClub: {
      id: 'club-789',
      name: 'Padel Center Paris',
      bookingCount: 28
    },
    bookingsByMonth: [
      { month: 'novembre 2025', count: 8, spent: 200 },
      { month: 'octobre 2025', count: 12, spent: 300 },
      // ... last 6 months
    ]
  }
}
```

**Frontend Hook (`paddle-app/src/hooks/useBooking.ts`):**
React hook for comprehensive booking management:

**State:**
- `bookings` - Current booking list
- `currentBooking` - Selected booking details
- `statistics` - User booking statistics
- `pagination` - Pagination info
- `loading` - Data loading state
- `actionLoading` - Action in progress state
- `error` - Error message

**Methods:**

**Booking Operations:**
- `createBooking(data)` - Create new booking with validation
- `loadBookingById(bookingId)` - Load specific booking
- `updateBooking(bookingId, data)` - Modify booking
- `cancelBooking(bookingId)` - Cancel booking

**Data Loading:**
- `loadMyBookings(filters?)` - Load user bookings with filters
- `loadUpcomingBookings(page?, limit?)` - Load future bookings
- `loadStatistics()` - Load user statistics
- `checkAvailability(courtId, date)` - Check court availability
- `loadMore(filters?)` - Load next page

**Utilities:**
- `refresh(filters?)` - Refresh booking list
- `reset()` - Reset all state

**Helpers:**
- `hasMore` - Boolean, more pages available
- `isEmpty` - Boolean, no bookings
- `upcomingCount` - Number of upcoming bookings

**Usage Example:**

```typescript
import { useBooking } from '@/hooks/useBooking';

function BookingScreen() {
  const {
    bookings,
    loading,
    error,
    createBooking,
    loadUpcomingBookings,
    cancelBooking,
    checkAvailability,
    upcomingCount,
  } = useBooking(true); // Auto-load on mount

  useEffect(() => {
    loadUpcomingBookings();
  }, []);

  const handleCreateBooking = async () => {
    const booking = await createBooking({
      courtId: 'court-123',
      date: '2025-11-18',
      startTime: '14:00',
      endTime: '15:30',
      paymentMethod: 'CARD',
    });

    if (booking) {
      Alert.alert('Success', 'Booking created!');
      navigation.navigate('BookingDetails', { bookingId: booking.id });
    }
  };

  const handleCheckAvailability = async () => {
    const availability = await checkAvailability('court-123', '2025-11-18');

    if (availability) {
      const availableSlots = availability.slots.filter(s => s.available);
      console.log(`${availableSlots.length} slots available`);
    }
  };

  const handleCancel = async (bookingId: string) => {
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            const success = await cancelBooking(bookingId);
            if (success) {
              Alert.alert('Cancelled', 'Booking cancelled successfully');
            }
          },
        },
      ]
    );
  };

  return (
    <View>
      <Text>You have {upcomingCount} upcoming bookings</Text>

      <FlatList
        data={bookings}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() => navigation.navigate('BookingDetails', { bookingId: item.id })}
            onCancel={() => handleCancel(item.id)}
          />
        )}
      />
    </View>
  );
}
```

**Availability Display Example:**

```typescript
import { useBooking } from '@/hooks/useBooking';
import { useState } from 'react';

function CourtAvailabilityScreen({ route }) {
  const { courtId } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState(null);
  const { checkAvailability, loading } = useBooking();

  useEffect(() => {
    loadAvailability();
  }, [selectedDate]);

  const loadAvailability = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const result = await checkAvailability(courtId, dateStr);
    setAvailability(result);
  };

  const handleSlotPress = async (slot) => {
    if (!slot.available) return;

    navigation.navigate('CreateBooking', {
      courtId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: slot.price,
    });
  };

  return (
    <View>
      <DatePicker value={selectedDate} onChange={setSelectedDate} />

      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={availability?.slots || []}
          renderItem={({ item: slot }) => (
            <TimeSlotCard
              slot={slot}
              onPress={() => handleSlotPress(slot)}
              disabled={!slot.available}
            />
          )}
        />
      )}
    </View>
  );
}
```

**Integration with Notifications:**

The booking service automatically sends notifications:
- **Booking confirmed:** `sendBookingConfirmationNotification(userId, clubName, dateTime, bookingId)`
- **Booking cancelled:** `sendBookingCancellationNotification(userId, clubName, dateTime)`

These integrate with the Firebase Push Notifications module for real-time updates.

**Key Features:**

1. **Complete Booking Lifecycle:**
   - Creation with real-time availability check
   - Modification with re-validation
   - Cancellation with refund policy
   - Automatic completion for past bookings
   - Expiration cleanup for unpaid bookings

2. **Smart Availability:**
   - Time slot generation based on court schedule
   - Conflict detection across all bookings
   - Club opening hours integration
   - 90-minute default slot duration
   - Visual availability calendar support

3. **Payment Integration:**
   - Stripe payment intent support (ready)
   - Multiple payment methods (CARD, CASH, ON_SITE, SUBSCRIPTION)
   - Automatic refund handling
   - Payment status tracking

4. **Analytics & Insights:**
   - Total bookings and spending
   - Favorite club identification
   - Monthly booking trends
   - Upcoming vs completed tracking
   - Cancellation rate monitoring

5. **Security & Validation:**
   - User authorization checks
   - Status-based permissions
   - Input validation (dates, times, durations)
   - Price calculation verification
   - Court availability re-checks

**Best Practices:**

1. Always check availability before showing booking UI
2. Display clear pricing before user confirms
3. Show cancellation policy and deadline
4. Provide visual calendar for availability
5. Cache availability data (1-5 minute TTL)
6. Implement optimistic UI updates
7. Handle payment failures gracefully
8. Show remaining time for PENDING bookings
9. Confirm cancellations with users
10. Display booking history with filters

**Cron Jobs:**

For production deployment, schedule these tasks:

```bash
# Every 5 minutes - cleanup expired PENDING bookings
*/5 * * * * curl -X POST https://api.paddle-app.com/api/bookings/cleanup

# Every hour - auto-complete past bookings
0 * * * * curl -X POST https://api.paddle-app.com/api/bookings/cleanup
```

This ensures:
- Abandoned bookings (unpaid) don't block slots
- Past bookings are marked as completed
- Statistics remain accurate

---

## Version History

- **v1.7.0** (2025-11-16): Sprint 2 - Complete Booking System! 📅
  - ✅ **Complete Booking System:** Full court reservation management with payment integration
    - Backend booking service with comprehensive lifecycle management
    - 13 REST API endpoints for booking operations
    - Real-time availability checking with conflict detection
    - Time slot generation (90-minute intervals with club hours)
    - Automatic price calculation based on court hourly rates
    - Cancellation policy enforcement (24-hour refund rule)
    - Payment integration (Stripe ready, multi-method support)
    - Booking expiration cleanup (30-minute timeout for PENDING)
    - Auto-completion of past bookings
    - User booking statistics and analytics
    - Favorite club identification
    - Monthly booking trends (last 6 months)
    - Availability calendar (day and week views)
    - Conflict detection algorithm (4 overlap scenarios)
    - useBooking hook for React integration
  - **Availability System:** Automatic time slot generation, opening hours integration, visual calendar support
  - **Payment Features:** Multiple payment methods (CARD, CASH, ON_SITE, SUBSCRIPTION), automatic refunds
  - **Statistics:** Total/upcoming/completed/cancelled bookings, total spent, favorite club, monthly trends
  - **New Files Added:** 3 files (booking.service.ts, booking.routes.ts, useBooking.ts)
  - **Sprint 2 Progress:** 4/5 features complete (80%)
  - **Completion:** ~80-85% of MVP (booking system operational!)

- **v1.6.0** (2025-11-16): Sprint 2 - Match Management Complete! 🎾
  - ✅ **Complete Match Management System:** Full match lifecycle with intelligent recommendations
    - Backend match service with comprehensive CRUD operations
    - 14 REST API endpoints for match management
    - Advanced search with 10+ filter combinations
    - Real-time scoring system with set-by-set tracking
    - Automatic player statistics updates (win/loss, ELO, streaks)
    - Smart match recommendations (multi-factor scoring algorithm)
    - Match history with pagination
    - Geographic search integration (location-aware matching)
    - Team management for doubles matches
    - Match status lifecycle (SCHEDULED → IN_PROGRESS → COMPLETED)
    - Organizer-only operations (start, score, complete, cancel)
    - Participant management (join/leave with team selection)
    - useMatch hook for React integration
  - **Recommendation Algorithm:** 5-factor scoring (skill level 40pts, distance 30pts, timing 15pts, spots 10pts, type 5pts)
  - **Statistics Tracking:** Auto-updates total matches, win rate, streaks, play time, ELO score
  - **New Files Added:** 3 files (match.service.ts, match.routes.ts, useMatch.ts)
  - **Sprint 2 Progress:** 3/5 features complete (60%)
  - **Completion:** ~70-75% of MVP (core match management operational!)

- **v1.5.0** (2025-11-16): Sprint 2 - Geolocation & Maps Complete! 📍
  - ✅ **Geolocation & Maps Module:** Complete location-based features
    - GeolocationService with permission handling and distance calculations
    - useGeolocation hook with auto-permission checking
    - MapView component with Google Maps integration
    - CourtMapView specialized component for court display
    - Backend location service with geographic search
    - 6 location-based API endpoints (nearby players/clubs/courts/matches)
    - Bounding box optimization for database queries
    - Haversine formula for accurate distance calculations
    - Real-time location tracking with watch position
    - Radius filtering and sorting by distance
    - Map markers with color coding (Indoor/Outdoor)
    - User location display on map
    - Radius circle visualization
    - Automatic map bounds fitting
  - **Search Features:** Skill level filtering, court type filtering, availability filtering, distance sorting
  - **Performance:** Bounding box pre-filtering reduces DB load significantly
  - **New Files Added:** 6 files (geolocation.service.ts, useGeolocation.ts, MapView.tsx, CourtMapView.tsx, location.service.ts, location.routes.ts)
  - **Sprint 2 Progress:** 2/5 features complete (40%)
  - **Completion:** ~65-70% of MVP (location-based discovery operational!)

- **v1.4.0** (2025-11-16): Sprint 2 - Real-time Chat Complete! 💬
  - ✅ **Real-time Chat with Socket.io:** Complete messaging system
    - Backend Socket.io configuration with JWT authentication
    - Chat service backend for conversation management
    - 12 REST API endpoints for chat operations
    - Frontend Socket.io client for real-time messaging
    - useChat hook for easy React integration
    - Direct and group conversations support
    - Real-time message delivery and read receipts
    - Typing indicators with auto-timeout
    - Offline message notifications (integrated with FCM)
    - Message pagination and history loading
    - Conversation muting and deletion
    - Unread count tracking
    - Match chat support for in-game communication
  - **New Files Added:** 5 files (socket.config.ts, chat.service.ts backend, chat.routes.ts, chat.service.ts frontend, useChat.ts)
  - **Sprint 2 Progress:** 1/5 features complete (20%)
  - **Completion:** ~60-65% of MVP (real-time engagement features operational!)

- **v1.3.0** (2025-11-16): Sprint 1 - COMPLETE! 🎉
  - ✅ **Firebase Push Notifications:** Complete FCM integration
    - Backend notification service with Firebase Admin SDK
    - Device token management with automatic cleanup
    - 8 notification templates for common events
    - Frontend FCM service with Notifee for local notifications
    - useNotifications hook for easy integration
    - Android notification channels (4 channels)
    - Badge count management for iOS
    - Deep linking on notification tap
  - **New Files Added:** 3 files (notification.service.ts backend, notification.service.ts frontend, useNotifications.ts hook)
  - **Prisma Schema:** Added DeviceToken model and Platform enum
  - **Sprint 1 Status:** ✅ 6/6 features complete (100%)
  - **Completion:** ~55-60% of MVP (critical authentication and payment systems complete)

- **v1.2.0** (2025-11-16): Sprint 1 - Payment Integration Complete
  - ✅ **Stripe Integration:** Complete payment system with webhooks
    - Backend service with subscription lifecycle management
    - Frontend Stripe Payment Sheet integration
    - Subscription screen with plan comparison UI
    - Webhook handling for automated sync
    - Customer Portal for self-service
  - **New Files Added:** 3 files (stripe.service.ts backend, stripe.service.ts frontend, SubscriptionScreen.tsx)
  - **Completion:** ~50-55% of MVP (critical payment system complete)

- **v1.1.0** (2025-11-16): Sprint 1 - Critical MVP Features
  - ✅ **Social Authentication:** Google, Apple, Facebook OAuth complete
  - ✅ **Biometric Authentication:** Face ID, Touch ID, Fingerprint support
  - ✅ **Email Service:** Verification, password reset, welcome, booking emails
  - ✅ **Subscription Module:** In-App Purchase with StoreKit & Google Play Billing
  - ⏳ Firebase Push Notifications (pending)
  - **New Files Added:** 9 new services/components/hooks
  - **Completion:** ~45-50% of MVP (increased from 30-40%)

- **v1.0.0** (2025-11-16): Initial project structure and core features implemented
  - Backend API with authentication
  - Mobile app architecture
  - Design system
  - Redux store configuration
  - Navigation structure
  - **7 Common UI Components:** Button, Input, Card, Avatar, Loading, ErrorMessage, Badge
  - **3 Feature Components:** PlayerCard, MatchCard, CourtCard
  - **Authentication Screens:** Onboarding, Login, SignUp, ForgotPassword
  - **Main Screens:** Home, Search, Profile, Matches, More/Settings
  - Comprehensive test suite (10 component tests + 3 feature tests + 1 screen test)
  - testID props for component testability
  - Matches screen with tabs (upcoming, organized, past)
  - Feature components with default and compact variants
  - **MoreScreen:** Complete settings screen with 5 sections (Account, Preferences, Activity, Support, Legal)
  - **Jest Configuration:** React Native preset with test infrastructure
  - **Axios Configuration:** Instance with automatic token refresh and error handling
  - **API Services:** 4 complete services (auth, user, match, court) with 60+ endpoints
  - Shared theme mock for consistent testing
  - 85/110 tests passing (all MoreScreen tests passing)

---

**Last Updated:** November 16, 2025
**Maintained By:** Claude AI Assistant

**Note:** This document reflects the current state of the Paddle-App project. Update it when making significant architectural changes or adding new patterns.
