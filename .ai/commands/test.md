---
description: Run tests with coverage
---

# Test Command

Run project tests with appropriate configuration.

## What This Does

1. Detect test framework (vitest, jest, etc.)
2. Run tests with coverage if available
3. Report results and failures

## Usage

```
/test                      # Run all tests
/test <pattern>            # Run matching tests
/test --watch              # Run in watch mode
/test --coverage           # With coverage report
```

$ARGUMENTS
