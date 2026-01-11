# Frontend BDD/TDD Workflow

> Behavior-Driven and Test-Driven Development for frontend applications.

## Overview

```
Feature Spec → Component Tests → Implementation → Integration Tests → E2E Tests
```

Frontend testing focuses on:
- **User interactions** - What users can do
- **Visual behavior** - What users see
- **State management** - How data flows
- **Integration** - How components work together

---

## Test Pyramid (Frontend)

```
        /   E2E    \      ← Few: Critical user journeys
       /  Integration\    ← Some: Component interactions
      /    Component   \  ← Many: Isolated component tests
     /       Unit       \ ← Many: Utilities, hooks, helpers
```

| Level | Scope | Speed |
|-------|-------|-------|
| Unit | Functions, utilities, helpers | Fast |
| Component | Single component in isolation | Fast |
| Integration | Multiple components together | Medium |
| E2E | Full user flows in browser | Slow |

> **Stack-specific tools**: See your stack's `workflows/bdd-tdd-frontend.md` for framework-specific testing tools and examples.

---

## BDD Workflow

### Step 1: Write Feature Spec

Start with user-facing behavior in Gherkin format:

```gherkin
# features/login.feature

Feature: User Login
  As a registered user
  I want to log into my account
  So that I can access my dashboard

  Background:
    Given the login page is displayed

  Scenario: Successful login
    When I enter valid credentials
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see my username in the header

  Scenario: Invalid password
    When I enter a valid email
    And I enter an incorrect password
    And I click the login button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  Scenario: Empty form submission
    When I click the login button without entering credentials
    Then I should see validation errors for email and password
```

### Step 2: Convert to Test Cases

Transform Gherkin scenarios into test cases using your framework's testing tools.

**Pseudocode pattern:**

```
describe('LoginForm')
  describe('Successful login')
    it('should redirect to dashboard after valid login')
      // Given - render the component
      // When - simulate user input and actions
      // Then - assert expected outcomes

  describe('Invalid password')
    it('should show error message for invalid credentials')
      // Given - setup mock to return error
      // When - enter credentials and submit
      // Then - assert error message visible

  describe('Empty form submission')
    it('should show validation errors')
      // Given - render form
      // When - submit without input
      // Then - assert validation errors visible
```

> **Stack examples**: See `stacks/[your-stack]/workflows/bdd-tdd-frontend.md` for concrete code examples.

---

## TDD Workflow

### Red-Green-Refactor Cycle

```
1. RED    → Write failing test
2. GREEN  → Write minimum code to pass
3. REFACTOR → Improve code, keep tests green
```

### Example Flow

1. **RED** - Write a test for behavior that doesn't exist yet
2. **GREEN** - Write the simplest code to make test pass
3. **REFACTOR** - Clean up while keeping tests green
4. **Repeat** - Add next behavior

### TDD Benefits

- Forces thinking about requirements first
- Creates documentation through tests
- Enables safe refactoring
- Catches regressions immediately

---

## Testing Patterns

### Arrange-Act-Assert (AAA)

```
// Arrange - set up test conditions
[setup component, mock data, configure environment]

// Act - perform the action being tested
[simulate user action or trigger behavior]

// Assert - verify the expected outcome
[check results match expectations]
```

### Given-When-Then (BDD style)

```
// Given - preconditions
[the component is rendered with specific props]

// When - action
[user clicks button / enters text / submits form]

// Then - expected outcome
[specific result is visible / action is triggered]
```

---

## What to Test

### Component Tests

| Test | Example |
|------|---------|
| Renders correctly | Shows expected content with given props |
| Handles interactions | Click, type, submit behaviors work |
| Shows states | Loading, error, empty, success states |
| Conditional rendering | Shows/hides based on conditions |
| Accessibility | Has proper labels, roles, keyboard support |

### Integration Tests

| Test | Example |
|------|---------|
| Component communication | Parent-child data flow |
| State updates | Actions trigger correct state changes |
| Navigation | Routes change correctly |
| Form flows | Multi-step processes work |

### E2E Tests

| Test | Example |
|------|---------|
| Critical paths | Login → Dashboard → Action → Logout |
| User journeys | Complete purchase flow |
| Cross-page flows | Search → Results → Detail → Back |

---

## Test Organization

```
src/
├── components/
│   └── Button/
│       ├── Button.[ext]
│       ├── Button.test.[ext]     # Component tests
│       └── index.[ext]
├── features/
│   └── auth/
│       ├── LoginForm.[ext]
│       └── LoginForm.test.[ext]  # Feature tests
└── utils/
    ├── format.[ext]
    └── format.test.[ext]         # Unit tests

e2e/
├── auth.spec.[ext]               # E2E: Auth flows
└── checkout.spec.[ext]           # E2E: Checkout flows
```

---

## Mocking Strategies

### When to Mock

| Mock | When |
|------|------|
| API calls | Always mock external HTTP requests |
| Time/dates | When testing time-dependent behavior |
| External services | Third-party integrations |
| Complex dependencies | Heavy or slow dependencies |

### When NOT to Mock

| Don't Mock | Why |
|------------|-----|
| The component under test | You're testing it! |
| Simple utilities | Test them directly |
| Child components (usually) | Test integration |

---

## Checklist

### Before Writing Tests
- [ ] Feature spec/requirements clear
- [ ] Acceptance criteria defined
- [ ] Edge cases identified
- [ ] Test data planned

### Component Tests
- [ ] Renders correctly with props
- [ ] Handles user interactions
- [ ] Shows loading/error states
- [ ] Accessible (roles, labels)
- [ ] Edge cases covered

### Integration Tests
- [ ] Components work together
- [ ] Data flows correctly
- [ ] Navigation works
- [ ] State updates properly

### E2E Tests
- [ ] Critical user journeys covered
- [ ] Happy path tested
- [ ] Error scenarios tested
- [ ] Cross-browser (if needed)

### Test Quality
- [ ] Tests are readable
- [ ] Tests are independent
- [ ] No flaky tests
- [ ] Fast enough for CI
- [ ] Coverage goals met
