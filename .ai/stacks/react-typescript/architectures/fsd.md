# Feature-Sliced Design (FSD) Architecture

> Architectural methodology for frontend applications with strict layer hierarchy and isolation.

## Overview

FSD organizes code into **layers** (horizontal) and **slices** (vertical), with each slice containing **segments**.

```
src/
├── app/          ← Layer 1: App initialization, providers, routing
├── pages/        ← Layer 2: Full page compositions
├── widgets/      ← Layer 3: Large self-contained UI blocks
├── features/     ← Layer 4: User interactions, actions
├── entities/     ← Layer 5: Business entities (User, Product, Order)
└── shared/       ← Layer 6: Reusable utilities, UI kit, configs
```

---

## Layer Definitions

### Layer 1: `app/`

Application initialization, global providers, routing configuration.

```
src/app/
├── providers/           # Context providers (QueryClient, Theme, Auth)
│   ├── index.tsx
│   ├── query-provider.tsx
│   └── theme-provider.tsx
├── routes/              # Route definitions
│   ├── index.tsx
│   └── private-route.tsx
├── styles/              # Global styles
│   └── global.css
└── index.tsx            # App entry point
```

**Rules:**
- Only layer that can import from ALL other layers
- Contains global setup (providers, error boundaries)
- No business logic

---

### Layer 2: `pages/`

Full page compositions. Each page combines widgets/features/entities.

```
src/pages/
├── home/
│   ├── ui/
│   │   └── HomePage.tsx
│   └── index.ts
├── users/
│   ├── ui/
│   │   ├── UsersPage.tsx
│   │   └── UserDetailPage.tsx
│   └── index.ts
└── settings/
    ├── ui/
    │   └── SettingsPage.tsx
    └── index.ts
```

**Rules:**
- Can import from: `widgets`, `features`, `entities`, `shared`
- Cannot import from: `app`, other `pages`
- Contains page-specific layout composition
- Minimal logic (delegate to features/widgets)

---

### Layer 3: `widgets/`

Large, self-contained UI blocks that combine features and entities.

```
src/widgets/
├── header/
│   ├── ui/
│   │   └── Header.tsx
│   ├── model/              # Widget-specific state (optional)
│   └── index.ts
├── sidebar/
│   ├── ui/
│   │   └── Sidebar.tsx
│   └── index.ts
└── user-table/
    ├── ui/
    │   └── UserTable.tsx
    ├── lib/                # Widget-specific utilities
    └── index.ts
```

**Rules:**
- Can import from: `features`, `entities`, `shared`
- Cannot import from: `app`, `pages`, other `widgets`
- Self-contained (can be moved between pages)
- May contain widget-specific state

---

### Layer 4: `features/`

User interactions and actions. Each feature is one specific user capability.

```
src/features/
├── auth/
│   ├── ui/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── LogoutButton.tsx
│   ├── model/
│   │   ├── auth.store.ts     # Zustand store
│   │   └── auth.types.ts
│   ├── api/
│   │   └── auth.api.ts       # API calls
│   ├── lib/
│   │   └── token.ts          # Feature-specific utils
│   └── index.ts
├── create-user/
│   ├── ui/
│   │   └── CreateUserForm.tsx
│   ├── model/
│   │   └── create-user.schema.ts
│   ├── api/
│   │   └── create-user.api.ts
│   └── index.ts
└── filter-users/
    ├── ui/
    │   └── UserFilters.tsx
    ├── model/
    │   └── filter.store.ts
    └── index.ts
```

**Rules:**
- Can import from: `entities`, `shared`
- Cannot import from: `app`, `pages`, `widgets`, other `features`
- One feature = One user action/capability
- Contains business logic for that feature

---

### Layer 5: `entities/`

Business domain entities. Data models and their UI representations.

```
src/entities/
├── user/
│   ├── ui/
│   │   ├── UserCard.tsx
│   │   ├── UserAvatar.tsx
│   │   └── UserBadge.tsx
│   ├── model/
│   │   ├── user.types.ts
│   │   └── user.store.ts     # Entity state (if needed)
│   ├── api/
│   │   └── user.api.ts       # CRUD operations
│   ├── lib/
│   │   └── format-user.ts    # Entity-specific utils
│   └── index.ts
├── product/
│   ├── ui/
│   │   ├── ProductCard.tsx
│   │   └── ProductPrice.tsx
│   ├── model/
│   │   └── product.types.ts
│   ├── api/
│   │   └── product.api.ts
│   └── index.ts
└── order/
    ├── ui/
    │   └── OrderSummary.tsx
    ├── model/
    │   └── order.types.ts
    └── index.ts
```

**Rules:**
- Can import from: `shared` only
- Cannot import from: any other layer
- Contains entity data structure and basic UI
- No feature-specific logic

---

### Layer 6: `shared/`

Reusable foundation. UI kit, utilities, configs, types.

```
src/shared/
├── ui/                      # UI Kit (design system)
│   ├── button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── input/
│   ├── modal/
│   └── index.ts
├── lib/                     # Utilities
│   ├── cn.ts                # className helper
│   ├── format-date.ts
│   └── index.ts
├── api/                     # API client setup
│   ├── client.ts
│   └── types.ts
├── config/                  # App configuration
│   └── env.ts
├── hooks/                   # Shared hooks
│   ├── use-debounce.ts
│   └── use-local-storage.ts
└── types/                   # Global types
    └── index.ts
```

**Rules:**
- Cannot import from: ANY other layer
- Foundation layer (no business logic)
- Highly reusable, business-agnostic

---

## Segment Structure

Each slice contains **segments** (standardized folders):

| Segment | Purpose | Example |
|---------|---------|---------|
| `ui/` | React components | `LoginForm.tsx` |
| `model/` | Business logic, state, types | `auth.store.ts` |
| `api/` | API interactions | `auth.api.ts` |
| `lib/` | Slice-specific utilities | `token.ts` |
| `config/` | Slice configuration | `routes.ts` |

### Segment Rules

```typescript
// ✅ Good: Public API via index.ts
// src/features/auth/index.ts
export { LoginForm } from './ui/LoginForm'
export { useAuth } from './model/auth.store'
export type { AuthState } from './model/auth.types'

// ❌ Bad: Direct import from segment
import { LoginForm } from '@/features/auth/ui/LoginForm'

// ✅ Good: Import from slice root
import { LoginForm } from '@/features/auth'
```

---

## Import Rules (Critical!)

```
Layer Dependency Direction (top can import from bottom):

  app/        ─────────────────────────────────────┐
    │                                               │
  pages/      ──────────────────────────────────┐  │
    │                                            │  │
  widgets/    ───────────────────────────────┐  │  │
    │                                         │  │  │
  features/   ────────────────────────────┐  │  │  │
    │                                      │  │  │  │
  entities/   ─────────────────────────┐  │  │  │  │
    │                                   │  │  │  │  │
  shared/     ◄─────────────────────────┴──┴──┴──┴──┘
```

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // shared cannot import from other layers
          { target: './src/shared', from: './src/entities' },
          { target: './src/shared', from: './src/features' },
          { target: './src/shared', from: './src/widgets' },
          { target: './src/shared', from: './src/pages' },
          { target: './src/shared', from: './src/app' },
          
          // entities cannot import from features+
          { target: './src/entities', from: './src/features' },
          { target: './src/entities', from: './src/widgets' },
          { target: './src/entities', from: './src/pages' },
          
          // features cannot import from widgets+
          { target: './src/features', from: './src/widgets' },
          { target: './src/features', from: './src/pages' },
          
          // widgets cannot import from pages
          { target: './src/widgets', from: './src/pages' },
          
          // No cross-slice imports within same layer
          // (handled by naming convention)
        ],
      },
    ],
  },
}
```

---

## Path Aliases

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/features/*": ["./src/features/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

---

## Naming Conventions

| Layer | Slice Naming | Example |
|-------|--------------|---------|
| pages | kebab-case | `user-profile/`, `settings/` |
| widgets | kebab-case | `header/`, `user-table/` |
| features | kebab-case (verb-noun) | `create-user/`, `filter-products/` |
| entities | singular noun | `user/`, `product/`, `order/` |
| shared | by type | `ui/`, `lib/`, `api/` |

---

## Common Patterns

### Cross-Entity Features

When a feature involves multiple entities:

```
src/features/
└── add-to-cart/           # Feature involving Product + Cart entities
    ├── ui/
    │   └── AddToCartButton.tsx
    ├── model/
    │   └── add-to-cart.ts
    └── index.ts

// The feature imports from both entities
import { Product } from '@/entities/product'
import { useCart } from '@/entities/cart'
```

### Shared State Between Features

Use entities layer for shared state:

```
src/entities/session/
├── model/
│   └── session.store.ts    # Shared session state
└── index.ts

// Multiple features can import from session entity
// src/features/auth/  → imports session
// src/features/settings/  → imports session
```

---

## Anti-Patterns

### ❌ Avoid

```typescript
// Cross-importing between slices in same layer
import { useAuth } from '@/features/auth'  // in features/profile - ❌

// Importing from higher layers
import { Header } from '@/widgets/header'  // in entities/user - ❌

// Direct segment imports
import { LoginForm } from '@/features/auth/ui/LoginForm'  // ❌

// Business logic in shared
// shared/lib/calculate-discount.ts with business rules - ❌
```

### ✅ Correct Approach

```typescript
// Use entities for shared data
import { useUser } from '@/entities/user'  // in features/profile - ✅

// Import from lower layers only
import { Button } from '@/shared/ui'  // in features/auth - ✅

// Import from slice public API
import { LoginForm } from '@/features/auth'  // ✅

// Business logic in appropriate layer
// entities/product/lib/calculate-discount.ts - ✅
```

---

## Migration Strategy

If migrating from non-FSD:

1. **Start with `shared/`** - Extract reusable UI and utilities
2. **Create `entities/`** - Identify core business entities
3. **Extract `features/`** - Separate user actions from entities
4. **Build `widgets/`** - Compose features and entities
5. **Organize `pages/`** - Simplify pages to compositions
6. **Setup `app/`** - Centralize initialization

---

## References

- [Official FSD Documentation](https://feature-sliced.design/)
- [FSD Examples Repository](https://github.com/feature-sliced/examples)
