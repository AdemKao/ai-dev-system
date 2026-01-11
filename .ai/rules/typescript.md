---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
description: TypeScript/JavaScript development rules
priority: 10
---

# TypeScript Rules

> Auto-applied when working with TypeScript/JavaScript files

## Type Conventions

- Prefer `interface` for object shapes
- Use `type` for union types and utility types
- Always define return types for exported functions
- Avoid `any`, use `unknown` with type guards

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Interface | PascalCase | `UserProfile` |
| Type | PascalCase | `ApiResponse` |
| Function | camelCase | `getUserById` |
| Constant | UPPER_SNAKE | `MAX_RETRIES` |
| Variable | camelCase | `userName` |

## Import Order

```typescript
// 1. Node.js built-ins
import path from 'path';

// 2. External packages
import { Command } from 'commander';

// 3. Internal modules (absolute)
import { config } from '@/config';

// 4. Relative imports
import { helper } from './utils';

// 5. Types
import type { User } from './types';
```

## Error Handling

```typescript
// ✅ Correct
try {
  await riskyOperation();
} catch (error) {
  if (error instanceof SpecificError) {
    // handle specific case
  }
  throw error; // re-throw if can't handle
}

// ❌ Wrong
try {
  await riskyOperation();
} catch (e) {
  console.log(e); // don't just log
}
```

## Async/Await

- Prefer `async/await` over `.then()` chains
- Use `Promise.all()` for parallel operations
- Avoid await in loops (consider `Promise.all`)
