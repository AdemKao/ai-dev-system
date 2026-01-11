# Stacked Development Workflow

> Workflow for developing large features with multiple small PRs using stacked branches and parallel development.

## Overview

```
Large Feature → Decompose → Dependency Graph → Execute (Stacked | Parallel) → PR Chain → Merge
```

---

## When to Use

| Scenario | Recommendation |
|----------|----------------|
| Feature touches 10+ files | Use this workflow |
| Multiple components affected | Use this workflow |
| Feature can be split into independent parts | Use parallel branches |
| Changes must be sequential (DB → API → UI) | Use stacked branches |
| Single file or small change | Use standard git workflow |

---

## Core Concepts

### Stacked Branches vs Parallel Branches

```
STACKED (Sequential Dependencies)          PARALLEL (Independent Work)
                                           
main ────●──────────────────────           main ────●──────────────────
         │                                          │
         └─ feat/api-types ──●                      ├─ feat/search-ui ──●
                             │                      │
                             └─ feat/api-impl ──●   └─ feat/filter-ui ──●
                                                │
                                                └─ feat/api-routes ──●

PR Order: api-types → api-impl → api-routes   PR Order: Any (independent)
```

### Dependency Types

| Type | Description | Strategy |
|------|-------------|----------|
| **Hard Dependency** | B cannot compile without A | Stacked branches |
| **Soft Dependency** | B works better with A | Stacked or parallel with coordination |
| **No Dependency** | A and B are independent | Parallel branches |

---

## Workflow Stages

### Stage 1: Feature Decomposition

Break down the feature into small, reviewable units:

```markdown
## Feature: User Property Search

### Decomposition

1. **PR1: Search Types & Interfaces** (base)
   - Files: types/search.ts, types/property.ts
   - Dependencies: None
   - Size: ~100 lines

2. **PR2: Search API Endpoint** (stacked on PR1)
   - Files: api/routes/search.ts, api/services/searchService.ts
   - Dependencies: PR1 (needs types)
   - Size: ~200 lines

3. **PR3: Search UI Component** (parallel, uses PR1 types)
   - Files: components/SearchBar.tsx, hooks/useSearch.ts
   - Dependencies: PR1 (needs types)
   - Size: ~150 lines

4. **PR4: Integration** (stacked on PR2, PR3)
   - Files: pages/SearchPage.tsx
   - Dependencies: PR2, PR3
   - Size: ~100 lines
```

### Stage 2: Dependency Graph

Visualize the dependency structure:

```
        ┌─────────────────┐
        │ PR1: Types      │
        │ (base)          │
        └────────┬────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌───────────────┐ ┌───────────────┐
│ PR2: API      │ │ PR3: UI       │
│ (stacked)     │ │ (parallel)    │
└───────┬───────┘ └───────┬───────┘
        │                 │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ PR4: Integration│
        │ (final)         │
        └─────────────────┘
```

### Stage 3: Branch Setup

#### For Stacked Branches

```bash
# Create base branch
git checkout develop
git checkout -b feat/search-types

# Work on types...
git add . && git commit -m "feat(search): add search types and interfaces"
git push -u origin feat/search-types

# Create stacked branch (based on previous)
git checkout -b feat/search-api  # Still on feat/search-types
# Work on API...
git add . && git commit -m "feat(search): implement search API endpoint"
git push -u origin feat/search-api
```

#### For Parallel Branches

```bash
# Create first parallel branch from common base
git checkout feat/search-types
git checkout -b feat/search-ui

# In another terminal/worktree, create second parallel branch
git checkout feat/search-types
git checkout -b feat/search-api
```

### Stage 4: PR Creation

#### Stacked PR Chain

```bash
# PR1: Base PR (target: develop)
gh pr create --base develop --head feat/search-types \
  --title "feat(search): add search types and interfaces" \
  --body "## Summary
- Add SearchParams, SearchResult types
- Add PropertyFilter interface

**Stack:** 1/4 (base)"

# PR2: Stacked PR (target: previous branch)
gh pr create --base feat/search-types --head feat/search-api \
  --title "feat(search): implement search API endpoint" \
  --body "## Summary
- Implement /api/search endpoint
- Add SearchService with filtering

**Stack:** 2/4 (depends on #123)
**Note:** Review after #123 is approved"
```

### Stage 5: Review & Merge

#### Merge Order (Critical!)

```
1. Review & Approve PR1 (base)
2. Merge PR1 into develop
3. Rebase PR2 onto develop (PR1 is now in develop)
4. Update PR2 base to develop
5. Review & Approve PR2
6. Merge PR2 into develop
7. Repeat for remaining PRs...
```

#### Rebase After Base Merged

```bash
# After PR1 merged to develop
git checkout feat/search-api
git fetch origin
git rebase origin/develop

# Update PR base branch
gh pr edit --base develop
git push --force-with-lease
```

---

## Parallel Development with Git Worktree

### When to Use Worktree

- Multiple independent tasks can run simultaneously
- Different AI agents working on different parts
- Need to switch context frequently

### Worktree Setup

```bash
# Create worktrees for parallel work
git worktree add ../project-search-ui feat/search-ui
git worktree add ../project-search-api feat/search-api

# Directory structure
/project/              # Main worktree (develop)
/project-search-ui/    # Worktree for UI work
/project-search-api/   # Worktree for API work
```

### Multi-Agent Coordination

When multiple AI agents work in different worktrees:

```
.tmp/worktree-session/{session-id}/
├── manifest.md           # Session overview and agent assignments
├── progress.md           # Real-time progress tracking
├── shared-context.md     # Shared decisions and conventions
├── locks/
│   └── {file-path}.lock  # File-level locks to prevent conflicts
└── agents/
    ├── agent-1.md        # Agent 1 status and current task
    └── agent-2.md        # Agent 2 status and current task
```

#### Manifest Example

```markdown
# Worktree Session: property-search

## Session ID: ws-20240115-001

## Agents

| Agent | Worktree | Branch | Task |
|-------|----------|--------|------|
| Agent 1 | /project-search-api | feat/search-api | Implement API |
| Agent 2 | /project-search-ui | feat/search-ui | Implement UI |

## Shared Files (Coordinate Before Editing)

- types/search.ts - Shared type definitions
- constants/search.ts - Shared constants

## Communication Protocol

1. Before editing shared file: Create lock
2. After editing shared file: Remove lock, update progress.md
3. If lock exists: Wait or coordinate with other agent
```

#### Lock File Format

```markdown
# Lock: types/search.ts

- Agent: Agent 1
- Worktree: /project-search-api
- Since: 2024-01-15T10:30:00Z
- Reason: Adding SearchParams interface
- ETA: 5 minutes
```

---

## PR Splitting Strategies

### Strategy 1: By Layer (Vertical Slice)

Best for: Changes that must be sequential

```
Layer 1: Database/Types    → PR1
Layer 2: Service/Business  → PR2 (stacked on PR1)
Layer 3: API/Controller    → PR3 (stacked on PR2)
Layer 4: UI/Frontend       → PR4 (stacked on PR3)
```

### Strategy 2: By Feature (Horizontal Slice)

Best for: Independent features

```
Feature A: Search by keyword  → PR1 (parallel)
Feature B: Filter by price    → PR2 (parallel)
Feature C: Filter by location → PR3 (parallel)
Integration: Combine filters  → PR4 (depends on all)
```

### Strategy 3: By Risk (Safe First)

Best for: Refactoring or migrations

```
PR1: Add new code path (additive, safe)
PR2: Add feature flag (toggle between old/new)
PR3: Migrate usage to new path
PR4: Remove old code path (after validation)
```

### Strategy 4: By Reviewability

Target: Each PR is reviewable in <30 minutes

```
Rule of thumb:
- < 200 lines of logic: Single PR
- 200-500 lines: Consider splitting
- > 500 lines: Must split
```

---

## Tooling Options

### Option 1: Manual Git Commands

Pros: No dependencies, full control
Cons: More commands, easier to make mistakes

### Option 2: git-stack

```bash
# Install
cargo install git-stack

# Sync all stacked branches
git sync

# Navigate stack
git next  # Move to child branch
git prev  # Move to parent branch

# View stack
git stack
```

### Option 3: spr (Stacked Pull Requests)

```bash
# Install
brew install ejoffe/tap/spr

# Update all PRs in stack
git spr update

# Check status
git spr status

# Merge when ready
git spr merge
```

---

## Best Practices

### DO

- Keep each PR focused and small (<400 lines)
- Document dependencies in PR description
- Use clear naming: `feat/feature-part1`, `feat/feature-part2`
- Rebase frequently to avoid conflicts
- Communicate with other agents via shared context files

### DON'T

- Don't create circular dependencies
- Don't modify shared files without coordination
- Don't merge out of order
- Don't let stacks grow beyond 4-5 PRs

---

## Troubleshooting

### Stack Got Out of Sync

```bash
# Rebase entire stack
git checkout feat/part3
git rebase --onto origin/develop old-base feat/part3
git checkout feat/part2
git rebase feat/part3
git checkout feat/part1
git rebase feat/part2
```

### Conflict in Stacked Branch

```bash
# Resolve conflict
git checkout feat/part2
git rebase feat/part1
# Resolve conflicts...
git rebase --continue
git push --force-with-lease
```

### Need to Add Changes to Base PR

```bash
# Add to base
git checkout feat/part1
# Make changes...
git commit --amend  # or new commit

# Rebase all dependent branches
git checkout feat/part2
git rebase feat/part1
git checkout feat/part3
git rebase feat/part2
```

---

## Checklist

### Before Starting

- [ ] Feature decomposed into small PRs
- [ ] Dependencies mapped
- [ ] Branch strategy chosen (stacked/parallel/hybrid)
- [ ] Worktrees created (if parallel)

### During Development

- [ ] Each PR is focused and small
- [ ] PR descriptions document dependencies
- [ ] Shared files coordinated
- [ ] Progress tracked in session files

### Before Merge

- [ ] All PRs in stack reviewed
- [ ] Merge order confirmed
- [ ] Rebased onto latest base
- [ ] CI passing on all PRs

### After Merge

- [ ] Dependent branches rebased
- [ ] PR bases updated
- [ ] Worktrees cleaned up
- [ ] Session files archived/deleted
