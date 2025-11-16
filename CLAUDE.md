# CLAUDE.md - AI Assistant Guide for Paddle-App

This document provides comprehensive guidance for AI assistants working on the Paddle-App codebase.

## Repository Overview

**Project Name:** Paddle-App
**Purpose:** Mobile application for paddle/padel players - Find partners, book courts, track performance
**Type:** React Native Mobile App (iOS/Android) + Node.js Backend API
**Status:** ✅ Development - Core architecture implemented
**Version:** 1.0.0
**Tech Stack:** React Native 0.74, TypeScript, Node.js 20, PostgreSQL, Prisma, Redux Toolkit
**Business Model:** Freemium with subscriptions (Standard: 9.99€/month, Premium: 14.99€/month)

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

## Common Patterns

### API Service Pattern

```typescript
// paddle-app/src/api/services/auth.service.ts
import axios from '@/api/axios.config';

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData: RegisterData) {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },
};
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

```bash
cd paddle-app

# Unit tests
npm test

# E2E tests (Detox)
npm run detox:build:ios
npm run detox:test:ios
```

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

## Version History

- **v1.0.0** (2025-11-16): Initial project structure and core features implemented
  - Backend API with authentication
  - Mobile app architecture
  - Design system
  - Redux store configuration
  - Navigation structure
  - 7 common UI components (Button, Input, Card, Avatar, Loading, ErrorMessage, Badge)

---

**Last Updated:** November 16, 2025
**Maintained By:** Claude AI Assistant

**Note:** This document reflects the current state of the Paddle-App project. Update it when making significant architectural changes or adding new patterns.
