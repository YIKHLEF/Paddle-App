# CLAUDE.md - AI Assistant Guide for Paddle-App

This document provides comprehensive guidance for AI assistants working on the Paddle-App codebase.

## Repository Overview

**Project Name:** Paddle-App
**Purpose:** Mobile application for paddle/padel players - Find partners, book courts, track performance
**Type:** React Native Mobile App (iOS/Android) + Node.js Backend API
**Status:** ✅ Development - MVP in progress (Sprint 1 completed)
**Version:** 1.1.0
**Tech Stack:** React Native 0.74, TypeScript, Node.js 20, PostgreSQL, Prisma, Redux Toolkit
**Business Model:** Freemium with subscriptions (Standard: 9.99€/month, Premium: 14.99€/month)

## 🆕 Recent Updates (v1.1.0 - Sprint 1 Completed)

### ✅ New Features Implemented:

**1. Social Authentication (Google/Apple/Facebook)**
- ✅ Backend OAuth service (`paddle-api/src/services/oauth.service.ts`)
- ✅ OAuth routes (`paddle-api/src/routes/oauth.routes.ts`)
- ✅ Frontend SocialLoginButtons component
- ✅ Social auth configuration (`paddle-app/src/config/socialAuth.config.ts`)
- ✅ Updated auth service with social login methods

**2. Biometric Authentication (Face ID / Touch ID)**
- ✅ Biometric service (`paddle-app/src/services/biometric.service.ts`)
- ✅ useBiometric hook (`paddle-app/src/hooks/useBiometric.ts`)
- ✅ BiometricSetting component for settings screen
- ✅ Support for iOS Face ID, Touch ID and Android Fingerprint

**3. Email Verification System**
- ✅ Email service with templates (`paddle-api/src/services/email.service.ts`)
- ✅ Verification email, password reset, welcome email, booking confirmation
- ✅ Nodemailer integration for SMTP

**4. Subscription & In-App Purchase Module**
- ✅ Subscription service (`paddle-app/src/services/subscription.service.ts`)
- ✅ useSubscription hook (`paddle-app/src/hooks/useSubscription.ts`)
- ✅ Support for iOS (StoreKit) and Android (Google Play Billing)
- ✅ Trial period management
- ✅ Purchase restoration
- ✅ Subscription status tracking

**Progress:** Sprint 1 features (4/6 completed)
- ✅ Social authentication
- ✅ Biometric authentication
- ✅ Email verification
- ✅ Subscription module
- ⏳ Stripe integration (pending)
- ⏳ Firebase Push Notifications (pending)

**Completion:** ~45-50% of MVP completed

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

## Version History

- **v1.1.0** (2025-11-16): Sprint 1 - Critical MVP Features
  - ✅ **Social Authentication:** Google, Apple, Facebook OAuth complete
  - ✅ **Biometric Authentication:** Face ID, Touch ID, Fingerprint support
  - ✅ **Email Service:** Verification, password reset, welcome, booking emails
  - ✅ **Subscription Module:** In-App Purchase with StoreKit & Google Play Billing
  - ⏳ Stripe integration (pending)
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
