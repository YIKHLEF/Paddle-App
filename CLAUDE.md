# CLAUDE.md - AI Assistant Guide for Paddle-App

This document provides comprehensive guidance for AI assistants working on the Paddle-App codebase.

## Repository Overview

**Project Name:** Paddle-App
**Purpose:** Application integrated with Paddle (payment/billing platform)
**Status:** New repository - structure to be established

## Project Structure

### Expected Directory Layout

```
Paddle-App/
├── src/                    # Source code
│   ├── api/               # API routes and endpoints
│   ├── components/        # Reusable UI components
│   ├── services/          # Business logic and external service integrations
│   ├── models/            # Data models and schemas
│   ├── utils/             # Utility functions and helpers
│   ├── config/            # Configuration files
│   └── types/             # TypeScript type definitions
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── docs/                  # Documentation
├── scripts/               # Build and deployment scripts
├── public/                # Static assets (if web app)
└── .github/              # GitHub workflows and templates
```

## Tech Stack

### Expected Technologies
- **Language:** TypeScript/JavaScript (Node.js)
- **Framework:** TBD (React, Next.js, Express, etc.)
- **Payment Integration:** Paddle SDK
- **Testing:** Jest, Vitest, or similar
- **Linting:** ESLint
- **Formatting:** Prettier
- **Package Manager:** npm, yarn, or pnpm

## Development Workflows

### Getting Started

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd Paddle-App
   npm install  # or yarn/pnpm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Configure Paddle API keys:
     - `PADDLE_VENDOR_ID`
     - `PADDLE_API_KEY`
     - `PADDLE_PUBLIC_KEY`
   - Set environment: `NODE_ENV=development`

3. **Run Development Server**
   ```bash
   npm run dev
   ```

### Branch Strategy

- **Main Branch:** `main` or `master` - production-ready code
- **Feature Branches:** `feature/<feature-name>` or `claude/<session-id>`
- **Bug Fix Branches:** `fix/<bug-description>`
- **Hot Fix Branches:** `hotfix/<issue>`

### Commit Conventions

Follow Conventional Commits specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, missing semicolons, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: add Paddle subscription webhook handler
fix: resolve payment confirmation timeout issue
docs: update API integration guide
refactor: extract payment service logic
test: add unit tests for subscription service
```

## Coding Conventions

### General Principles

1. **Code Quality**
   - Write self-documenting code with clear variable names
   - Keep functions small and focused (single responsibility)
   - Prefer composition over inheritance
   - Use async/await over raw promises
   - Handle errors explicitly

2. **TypeScript Usage**
   - Use strict mode
   - Define explicit types for function parameters and returns
   - Avoid `any` type; use `unknown` if type is truly unknown
   - Create type definitions for external API responses
   - Use interfaces for object shapes, types for unions/primitives

3. **File Organization**
   - One component/class per file
   - Co-locate related files (component + styles + tests)
   - Use barrel exports (index.ts) for cleaner imports
   - Keep files under 300 lines when possible

### Naming Conventions

- **Files:** kebab-case for regular files (`payment-service.ts`)
- **Components:** PascalCase for component files (`SubscriptionCard.tsx`)
- **Variables/Functions:** camelCase (`getUserSubscription`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Classes/Interfaces:** PascalCase (`PaymentProcessor`, `ISubscription`)
- **Type aliases:** PascalCase with descriptive names (`SubscriptionStatus`)

### Code Style

```typescript
// Good: Clear, typed, and well-structured
interface SubscriptionData {
  id: string;
  status: 'active' | 'canceled' | 'past_due';
  planId: string;
  userId: string;
}

async function getSubscription(userId: string): Promise<SubscriptionData> {
  try {
    const response = await paddleAPI.getSubscription(userId);
    return normalizeSubscriptionData(response);
  } catch (error) {
    logger.error('Failed to fetch subscription', { userId, error });
    throw new SubscriptionError('Unable to retrieve subscription');
  }
}

// Bad: Unclear, untyped, poor error handling
async function getSub(id) {
  const response = await paddleAPI.getSubscription(id);
  return response;
}
```

## Paddle Integration

### Key Concepts

1. **Webhook Handling**
   - Always verify webhook signatures
   - Handle webhooks idempotently
   - Process asynchronously when possible
   - Log all webhook events for debugging

2. **Payment Flow**
   - Initialize checkout with Paddle.js
   - Handle success/failure callbacks
   - Store transaction IDs for reconciliation
   - Implement proper error states in UI

3. **Subscription Management**
   - Sync subscription status via webhooks
   - Implement grace periods for payment failures
   - Handle plan upgrades/downgrades
   - Manage cancellation flows

### Security Considerations

1. **API Keys**
   - Never commit API keys to repository
   - Use environment variables
   - Rotate keys regularly
   - Use separate keys for dev/staging/production

2. **Webhook Verification**
   - Always verify Paddle webhook signatures
   - Use HTTPS endpoints only
   - Implement request timestamp validation
   - Log suspicious requests

3. **Data Handling**
   - Don't store sensitive payment data
   - Use Paddle's secure checkout
   - Comply with PCI DSS requirements
   - Implement proper data retention policies

## Testing Strategy

### Unit Tests

- Test business logic in isolation
- Mock external dependencies (Paddle API, database)
- Aim for 80%+ code coverage
- Test edge cases and error conditions

```typescript
// Example test structure
describe('SubscriptionService', () => {
  describe('createSubscription', () => {
    it('should create subscription with valid data', async () => {
      // Arrange
      const mockPaddleResponse = { ... };
      jest.spyOn(paddleAPI, 'create').mockResolvedValue(mockPaddleResponse);

      // Act
      const result = await subscriptionService.createSubscription(validData);

      // Assert
      expect(result.id).toBeDefined();
      expect(paddleAPI.create).toHaveBeenCalledWith(validData);
    });

    it('should throw error when Paddle API fails', async () => {
      // Test error handling
    });
  });
});
```

### Integration Tests

- Test API endpoints end-to-end
- Use test database
- Mock external services (Paddle webhooks)
- Verify database state changes

### E2E Tests

- Test critical user flows
- Payment checkout flow
- Subscription management
- Webhook processing

## Common Patterns

### Error Handling

```typescript
// Custom error classes
class PaddleAPIError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'PaddleAPIError';
  }
}

// Centralized error handler
function handleServiceError(error: unknown): never {
  if (error instanceof PaddleAPIError) {
    // Handle Paddle-specific errors
    throw new ServiceError('Payment service unavailable', error);
  }
  // Handle other errors
  throw error;
}
```

### API Client Pattern

```typescript
class PaddleClient {
  private readonly baseURL: string;
  private readonly apiKey: string;

  constructor(config: PaddleConfig) {
    this.baseURL = config.baseURL;
    this.apiKey = config.apiKey;
  }

  async request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    // Implement with retry logic, error handling, logging
  }

  // Specific methods
  async getSubscription(id: string): Promise<Subscription> {
    return this.request(`/subscriptions/${id}`);
  }
}
```

### Service Layer Pattern

```typescript
// Separate business logic from API routes
class SubscriptionService {
  constructor(
    private paddleClient: PaddleClient,
    private database: Database,
    private logger: Logger
  ) {}

  async createSubscription(data: CreateSubscriptionDTO): Promise<Subscription> {
    // Validate input
    // Call Paddle API
    // Store in database
    // Return normalized data
  }
}
```

## AI Assistant Guidelines

### When Making Changes

1. **Always Read Before Editing**
   - Read existing files before making modifications
   - Understand the current implementation
   - Check for similar patterns in the codebase

2. **Maintain Consistency**
   - Follow existing code style and patterns
   - Use the same libraries and approaches
   - Match the current project structure

3. **Test Your Changes**
   - Run existing tests
   - Add tests for new functionality
   - Verify builds pass

4. **Document Your Work**
   - Add JSDoc comments for public APIs
   - Update README if adding new features
   - Add inline comments for complex logic

### Common Tasks

#### Adding a New API Endpoint

1. Create route handler in `src/api/`
2. Implement service logic in `src/services/`
3. Add type definitions in `src/types/`
4. Write unit tests
5. Update API documentation

#### Integrating New Paddle Feature

1. Check Paddle SDK documentation
2. Add necessary types for API responses
3. Implement service layer wrapper
4. Add error handling
5. Test with Paddle sandbox
6. Document integration

#### Fixing Bugs

1. Understand the issue and reproduce
2. Write a failing test
3. Implement fix
4. Verify test passes
5. Check for similar issues elsewhere

### Security Checklist

Before committing changes, verify:

- [ ] No API keys or secrets in code
- [ ] Webhook signatures are verified
- [ ] User input is validated and sanitized
- [ ] SQL injection risks mitigated (use parameterized queries)
- [ ] XSS risks mitigated (escape output)
- [ ] Authentication/authorization checks in place
- [ ] Rate limiting implemented for public endpoints
- [ ] Sensitive data is encrypted at rest
- [ ] HTTPS enforced for all external communications

### Performance Considerations

- [ ] Database queries are optimized (use indexes)
- [ ] API responses include pagination for large datasets
- [ ] Caching implemented where appropriate
- [ ] Async operations don't block main thread
- [ ] Bundle size is reasonable (for frontend)
- [ ] Images and assets are optimized

## Debugging Guide

### Common Issues

1. **Paddle Webhook Not Received**
   - Check webhook URL is publicly accessible
   - Verify HTTPS certificate is valid
   - Check firewall/security group settings
   - Review Paddle dashboard for delivery logs

2. **Payment Fails**
   - Check test/live mode configuration
   - Verify product IDs are correct
   - Review Paddle dashboard error logs
   - Check user's payment method

3. **Subscription Status Out of Sync**
   - Review webhook processing logs
   - Check for failed webhook deliveries
   - Manually sync from Paddle API if needed
   - Verify database transaction handling

### Logging

Use structured logging:

```typescript
logger.info('Processing subscription webhook', {
  eventType: webhook.alert_name,
  subscriptionId: webhook.subscription_id,
  timestamp: new Date().toISOString()
});
```

### Monitoring

Key metrics to track:
- Webhook processing success rate
- Payment success rate
- API response times
- Subscription churn rate
- Failed payment retries

## Resources

### Paddle Documentation
- [Paddle API Reference](https://developer.paddle.com/api-reference)
- [Webhook Reference](https://developer.paddle.com/webhook-reference)
- [Paddle.js SDK](https://developer.paddle.com/paddlejs/overview)

### Development Tools
- Paddle Sandbox for testing
- Webhook testing tools (ngrok, Webhook.site)
- API clients (Postman, Insomnia)

## Version History

- **v1.0.0** (2025-11-16): Initial CLAUDE.md created for new repository

---

**Note for AI Assistants:** This document should be updated as the project evolves. When you make significant architectural decisions or establish new patterns, update this guide to reflect them.
