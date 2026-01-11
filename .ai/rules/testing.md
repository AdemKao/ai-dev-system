---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "**/__tests__/**"
  - "**/tests/**"
description: Testing development rules
priority: 20
---

# Testing Rules

> Auto-applied when working with test files

## Test Structure

```typescript
describe('ModuleName', () => {
  describe('functionName', () => {
    it('should do expected behavior when given input', () => {
      // Arrange
      const input = createTestInput();
      
      // Act
      const result = functionName(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

## Naming Conventions

| Type | Format |
|------|--------|
| describe | Module or function name |
| it/test | `should [behavior] when [condition]` |
| Variables | Use semantic names, not `x`, `y`, `data` |

## AAA Pattern

Every test should follow **Arrange-Act-Assert**:

```typescript
it('should return user when valid id provided', () => {
  // Arrange - prepare test data
  const userId = 'user-123';
  const mockUser = createMockUser({ id: userId });
  mockRepository.findById.mockResolvedValue(mockUser);
  
  // Act - execute the operation under test
  const result = await userService.getUser(userId);
  
  // Assert - verify results
  expect(result).toEqual(mockUser);
  expect(mockRepository.findById).toHaveBeenCalledWith(userId);
});
```

## Test Types

| Type | Scope | Speed | File Location |
|------|-------|-------|---------------|
| Unit | Single function/class | Fast | `*.test.ts` |
| Integration | Multiple modules | Medium | `*.integration.test.ts` |
| E2E | Full workflow | Slow | `e2e/*.spec.ts` |

## Mock Conventions

```typescript
// ✅ Correct - explicit mock
const mockFetch = vi.fn().mockResolvedValue({ data: [] });

// ❌ Wrong - unclear mock
const mock = vi.fn();
```

## Anti-Patterns to Avoid

- ❌ Testing implementation details instead of behavior
- ❌ Multiple assertions testing different behaviors
- ❌ Sharing mutable state
- ❌ Test names that don't describe expected behavior
