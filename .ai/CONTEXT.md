# AI Development Context

> **Entry Point** - AI agents automatically read this file at the start of each interaction.

## Project Info

| Field | Value |
|-------|-------|
| **Name** | ai-cowork |
| **Type** | AI Development Workflow System |
| **Language** | TypeScript |

## Smart Loading System

### 🚨 IMPORTANT: Context Loading Rules

**Always follow the minimal loading principle:**

1. **Analyze the task first** - Determine task type
2. **Check the route table** - See Quick Route below
3. **Load only what's needed** - Never preload "just in case"
4. **Token budget** - Keep context under 15KB per interaction

### Quick Route

| Task Type | Load File | Est. Size |
|-----------|-----------|-----------|
| Writing code | `context/core/standards/code-quality.md` | ~9KB |
| API development | `context/core/standards/openapi.md` | ~15KB |
| Writing tests | `context/core/workflows/bdd-tdd.md` | ~5KB |
| Code review | `context/core/workflows/code-review.md` | ~4KB |
| Git operations | `context/core/workflows/git-workflow.md` | ~6KB |
| Documentation | `context/core/standards/documentation.md` | ~7KB |
| Large features | `context/core/workflows/stacked-development.md` | ~12KB |
| Delegation | `context/core/workflows/delegation.md` | ~6KB |

### Conditional Rules (Auto-Applied)

When working with specific file types, rules are automatically loaded:

| File Pattern | Auto-Load Rule |
|--------------|----------------|
| `*.ts`, `*.tsx` | `rules/typescript.md` |
| `*.test.*`, `*.spec.*` | `rules/testing.md` |
| `src/api/**` | `rules/api.md` |
| `*.md` | `rules/documentation.md` |

### Stack Detection

System auto-detects project stack and loads corresponding standards:

```
package.json contains "react" → stacks/react-typescript/
composer.json contains "laravel" → stacks/php-laravel/
package.json contains "express" → stacks/node-express/
```

## Available Resources

### Skills (Load When Triggered)

| Skill | Trigger Keywords | Purpose |
|-------|------------------|---------|
| `commit` | commit, 提交 | Git commit best practices |
| `code-review` | review, 審查 | Code review process |
| `debug` | debug, 除錯 | Debugging methodology |
| `refactor` | refactor, 重構 | Refactoring techniques |
| `feature-decompose` | decompose, split | Large feature breakdown |
| `ui-ux` | UI, design | UI/UX best practices |
| `notify` | notify, 通知 | Send notifications |

### Agents (Load When Delegating)

| Agent | Expertise | When to Use |
|-------|-----------|-------------|
| `orchestrator` | Complex task coordination | Tasks with 4+ files |
| `explorer` | Fast search | Need to explore codebase |
| `oracle` | Architecture decisions | Need design advice |
| `frontend-engineer` | Frontend dev | UI component work |
| `backend-engineer` | Backend dev | API/service work |
| `tester` | Testing | Writing tests |
| `librarian` | Documentation | Writing docs |

## Keyword Triggers

Using these keywords in prompts auto-loads relevant context:

| Keyword | Effect |
|---------|--------|
| `ultrawork` or `ulw` | Enable full orchestration mode, load delegation.md |
| `review` | Load code-review workflow |
| `test` | Load testing workflow |
| `refactor` | Load code-quality + refactor skill |

## Loading Examples

### ✅ Correct Approach

```
User: "Review this PR"
AI:
1. Identify task: Code Review
2. Load: workflows/code-review.md (4KB)
3. Load: skills/code-review/SKILL.md (3KB)
4. Total: ~7KB ✓
```

### ❌ Wrong Approach

```
User: "Review this PR"
AI:
1. Load all standards (50KB+)
2. Load all workflows (40KB+)
3. Load all skills (30KB+)
4. Total: 120KB+ ✗ (Token waste!)
```

---

## Project Specifics

### Development Commands

```bash
# Development
cd cli && npm run dev

# Testing
cd cli && npm test

# Build
cd cli && npm run build
```

### Project Structure

```
cli/
├── src/
│   ├── commands/     # CLI commands
│   ├── utils/        # Utility functions
│   └── index.ts      # Entry point
└── package.json

.ai/
├── context/          # Loading routes & standards
├── agents/           # AI Agent definitions
├── skills/           # Reusable skills
├── stacks/           # Tech stack configs
├── rules/            # Conditional rules
└── commands/         # Custom commands
```

---

*This file is maintained by ai-cowork. See `.ai/config.json` for configuration.*
