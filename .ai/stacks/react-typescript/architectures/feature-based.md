# Feature-Based Architecture

> Simplified feature-based organization for small to medium React applications.

## Overview

Feature-based architecture groups code by **business feature** rather than technical type.

```
src/
├── app/              # App setup, routes, providers
├── features/         # Feature modules (vertical slices)
├── shared/           # Shared components, hooks, utils
├── services/         # External service integrations
└── types/            # Global TypeScript types
```

---

## Structure

### `app/`

Application entry point and configuration.

```
src/app/
├── App.tsx           # Root component
├── routes.tsx        # Route definitions
├── providers.tsx     # Context providers
└── global.css        # Global styles
```

### `features/`

Each feature is a self-contained module.

```
src/features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── index.ts
│   ├── api/
│   │   └── auth.api.ts
│   ├── types.ts
│   └── index.ts          # Public API
├── users/
│   ├── components/
│   │   ├── UserCard.tsx
│   │   ├── UserList.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useUsers.ts
│   │   └── index.ts
│   ├── api/
│   │   └── users.api.ts
│   ├── types.ts
│   └── index.ts
└── dashboard/
    ├── components/
    ├── hooks/
    └── index.ts
```

### `shared/`

Reusable code with no feature-specific logic.

```
src/shared/
├── components/
│   ├── ui/               # UI primitives (Button, Input, Modal)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   └── layout/           # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── index.ts
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── index.ts
├── utils/
│   ├── cn.ts             # className helper
│   ├── format.ts
│   └── index.ts
└── constants/
    └── index.ts
```

### `services/`

External service integrations.

```
src/services/
├── api/
│   ├── client.ts         # Axios/fetch setup
│   └── types.ts
├── storage/
│   └── local-storage.ts
└── analytics/
    └── index.ts
```

---

## Import Rules

```
Dependency Direction:

  app/        ───────────────────────────┐
    │                                     │
  features/   ────────────────────────┐  │
    │                                  │  │
  shared/     ◄────────────────────────┴──┘
  services/   ◄────────────────────────┴──┘
```

**Rules:**
1. `shared/` and `services/` cannot import from `features/`
2. `features/` can import from `shared/` and `services/`
3. Features should NOT import from other features (isolate them)
4. `app/` can import from everything

---

## Public API Pattern

Each feature exports only what's needed:

```typescript
// src/features/auth/index.ts
export { LoginForm, RegisterForm } from './components'
export { useAuth, useLogin } from './hooks'
export type { User, AuthState } from './types'

// Usage in app
import { LoginForm, useAuth } from '@/features/auth'
```

---

## When to Use

**Feature-Based is ideal for:**
- Small to medium applications
- Teams new to modular architecture
- Projects that may grow to FSD later

**Consider FSD when:**
- Application has 10+ features
- Multiple developers/teams
- Need strict boundary enforcement
- Complex cross-feature interactions

---

## Comparison with FSD

| Aspect | Feature-Based | FSD |
|--------|---------------|-----|
| Layers | 3-4 | 6-7 |
| Complexity | Simple | Complex |
| Learning curve | Low | Medium |
| Scalability | Medium | High |
| Strictness | Flexible | Strict |

---

## Migration to FSD

If project grows:

1. Split `features/` into `features/` + `entities/`
2. Add `widgets/` for composed UI blocks  
3. Add `pages/` layer
4. Apply stricter import rules
