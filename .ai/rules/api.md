---
paths:
  - "**/api/**"
  - "**/routes/**"
  - "**/controllers/**"
  - "**/handlers/**"
  - "**/endpoints/**"
description: API development rules
priority: 15
---

# API Rules

> Auto-applied when working with API-related files

## RESTful Design

| HTTP Method | Purpose | Success Response |
|-------------|---------|------------------|
| GET | Read resource | 200 OK |
| POST | Create resource | 201 Created |
| PUT | Full update | 200 OK |
| PATCH | Partial update | 200 OK |
| DELETE | Delete resource | 204 No Content |

## URL Naming

```
✅ Correct
GET    /api/v1/users          # List
GET    /api/v1/users/:id      # Single resource
POST   /api/v1/users          # Create
PUT    /api/v1/users/:id      # Update
DELETE /api/v1/users/:id      # Delete
GET    /api/v1/users/:id/posts # Nested resource

❌ Wrong
GET    /api/getUsers          # Using verbs
POST   /api/user/create       # CRUD verbs in URL
GET    /api/v1/User           # Capitalized
```

## Response Format

```typescript
// Success response
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

## Status Codes

| Code | When to Use |
|------|-------------|
| 400 | Bad request format |
| 401 | Unauthenticated |
| 403 | Unauthorized |
| 404 | Resource not found |
| 409 | Resource conflict |
| 422 | Validation failed |
| 500 | Server error |

## Input Validation

```typescript
// Always validate input at controller layer
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const validated = schema.parse(req.body);
```

## Security

- ✅ Use parameterized queries to prevent SQL Injection
- ✅ Validate and sanitize all user input
- ✅ Use rate limiting
- ✅ Log sensitive operations
- ❌ Don't put sensitive data in URLs
- ❌ Don't return sensitive fields (passwords, etc.)
