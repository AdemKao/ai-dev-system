# Backend BDD/TDD Workflow

> Behavior-Driven and Test-Driven Development for backend applications.

## Overview

```
API Contract → Feature Spec → Unit Tests → Implementation → Integration Tests → Contract Tests
```

Backend testing focuses on:
- **Business logic** - Domain rules and validations
- **Data integrity** - Database operations
- **API contracts** - Request/response correctness
- **Security** - Authentication, authorization

---

## Test Pyramid (Backend)

```
        /  Contract  \    ← Few: API matches spec
       /  Integration \   ← Some: DB, external services
      /     Service    \  ← Many: Business logic
     /       Unit       \ ← Many: Utilities, validators
```

| Level | Scope | Database | Speed |
|-------|-------|----------|-------|
| Unit | Functions, validators | No | Fast |
| Service | Business logic | No/Mock | Fast |
| Integration | Repositories, DB | Yes | Medium |
| Contract/API | Full endpoints | Yes | Medium |

> **Stack-specific tools**: See your stack's `workflows/bdd-tdd-backend.md` for framework-specific testing tools and examples.

---

## BDD Workflow

### Step 1: Write Feature Spec

```gherkin
# features/user-registration.feature

Feature: User Registration
  As a new visitor
  I want to create an account
  So that I can access the application

  Scenario: Successful registration
    Given no user exists with email "new@example.com"
    When I register with:
      | email    | new@example.com |
      | name     | John Doe        |
      | password | Password123!    |
    Then the user should be created
    And a welcome email should be queued
    And I should receive a JWT token

  Scenario: Duplicate email
    Given a user exists with email "existing@example.com"
    When I register with email "existing@example.com"
    Then I should receive a 409 Conflict error
    And the error message should be "Email already registered"

  Scenario: Invalid password
    When I register with password "weak"
    Then I should receive a 400 Bad Request error
    And the error should indicate password requirements
```

### Step 2: Convert to Test Cases

Transform Gherkin into test cases:

**Pseudocode pattern:**

```
describe('User Registration')
  describe('Successful registration')
    it('should create user and return JWT token')
      // Given - no existing user
      // When - POST /register with valid data
      // Then - 201 status, user in DB, token returned

  describe('Duplicate email')
    it('should return 409 when email exists')
      // Given - create existing user
      // When - POST /register with same email
      // Then - 409 status, error message

  describe('Invalid password')
    it('should return 400 for weak password')
      // When - POST /register with weak password
      // Then - 400 status, validation error
```

> **Stack examples**: See `stacks/[your-stack]/workflows/bdd-tdd-backend.md` for concrete code examples.

---

## TDD Workflow

### Red-Green-Refactor for Backend

```
1. RED    → Write failing test (service/repository)
2. GREEN  → Implement minimum code
3. REFACTOR → Clean up, extract patterns
```

### Layered TDD Approach

```
1. Start with Service layer tests
   └─→ Define business logic behavior

2. Implement Service
   └─→ May need Repository (mock first)

3. Add Integration tests for Repository
   └─→ Test actual database operations

4. Add API/Contract tests
   └─→ Test full request/response cycle
```

---

## Testing Layers

### Unit Tests (No Dependencies)

Test pure functions and validators:

```
describe('validateEmail')
  it('should return true for valid email')
  it('should return false for invalid email')

describe('calculateTotal')
  it('should sum item prices')
  it('should apply discount correctly')
```

**Characteristics:**
- No database
- No external services
- Fast execution
- Test edge cases

### Service Tests (Mocked Dependencies)

Test business logic with mocked repositories:

```
describe('UserService.createUser')
  it('should hash password before saving')
  it('should throw if email exists')
  it('should trigger welcome email')
```

**Characteristics:**
- Mock repositories
- Mock external services
- Focus on business rules
- Test error handling

### Integration Tests (Real Database)

Test data layer with actual database:

```
describe('UserRepository.create')
  it('should persist user to database')
  it('should generate UUID')
  it('should enforce unique email constraint')
```

**Characteristics:**
- Use test database
- Reset between tests
- Test constraints
- Test queries

### API/Contract Tests

Test full HTTP request/response:

```
describe('POST /api/users')
  it('should return 201 with user data')
  it('should return 400 for invalid input')
  it('should return 401 without auth')
```

**Characteristics:**
- Full request cycle
- Test authentication
- Test validation
- Verify response format

---

## Test Organization

```
src/
├── services/
│   ├── UserService.[ext]
│   └── UserService.test.[ext]    # Service tests
├── repositories/
│   ├── UserRepository.[ext]
│   └── UserRepository.test.[ext] # Integration tests
├── controllers/
│   └── UserController.[ext]
└── utils/
    ├── validators.[ext]
    └── validators.test.[ext]     # Unit tests

tests/
├── api/
│   └── users.api.test.[ext]      # API tests
├── fixtures/
│   └── users.[ext]               # Test data
└── helpers/
    └── setup.[ext]               # Test utilities
```

---

## Mocking Strategies

### What to Mock

| Mock | In Which Tests |
|------|----------------|
| Repositories | Service tests |
| External APIs | Service & Integration |
| Email/SMS services | All except E2E |
| Time/Date | When testing expiration |
| Random values | When testing tokens |

### What NOT to Mock

| Don't Mock | In Which Tests |
|------------|----------------|
| Database | Integration tests |
| Business logic | Never |
| The class under test | Never |

---

## Contract Testing

Ensure API matches OpenAPI specification:

```
1. Load OpenAPI spec
2. Make API request
3. Validate response against spec
4. Check status codes match
5. Check response schema matches
```

Benefits:
- Catches spec drift
- Documents actual behavior
- Enables parallel development

---

## Database Testing Patterns

### Test Isolation

```
Before each test:
  - Start transaction OR
  - Truncate tables OR
  - Use separate test database

After each test:
  - Rollback transaction OR
  - Clean up created data
```

### Factory Pattern

Create test data consistently:

```
UserFactory.create()           # Random user
UserFactory.create({ admin: true })  # Admin user
UserFactory.createMany(5)      # Multiple users
```

### Fixtures

Static test data for predictable tests:

```
fixtures/
├── users.json        # User test data
├── products.json     # Product test data
└── orders.json       # Order test data
```

---

## Checklist

### Before Writing Tests
- [ ] API contract (OpenAPI) defined
- [ ] Database schema (DBML) defined
- [ ] Business rules documented
- [ ] Edge cases identified

### Unit/Service Tests
- [ ] Business logic tested
- [ ] Error cases handled
- [ ] Validation tested
- [ ] Dependencies mocked

### Integration Tests
- [ ] Database operations work
- [ ] Transactions handled
- [ ] Constraints enforced
- [ ] Queries optimized

### API Tests
- [ ] All endpoints tested
- [ ] Auth/authz tested
- [ ] Validation errors tested
- [ ] Response format matches contract

### Test Quality
- [ ] Tests are independent
- [ ] Tests are deterministic
- [ ] Fast feedback loop
- [ ] Coverage goals met
