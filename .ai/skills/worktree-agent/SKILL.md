---
name: worktree-agent
description: Coordinate multiple AI agents working in parallel using git worktree. Use when setting up parallel development across multiple worktrees or coordinating agent work.
---

# Worktree Agent Coordination

Set up and coordinate multiple AI agents working in parallel git worktrees.

## Instructions

### Step 1: Assess Parallelization

Determine if worktree setup is beneficial:

```markdown
## Parallelization Assessment

**Feature:** [Name]

**Parallel Tasks:**
1. [Task A] - ~[N] hours
2. [Task B] - ~[N] hours
3. [Task C] - ~[N] hours

**Dependencies:**
- Task A and B: Independent (can parallel)
- Task C: Depends on A and B

**Time Savings:**
- Sequential: [N] hours
- Parallel: [N] hours
- Savings: [N] hours ([%] reduction)

**Recommendation:** [Use worktree | Not worth it]
```

### Step 2: Create Worktree Structure

```bash
# From main project directory
PROJECT_ROOT=$(pwd)
FEATURE="property-search"
SESSION_ID="ws-$(date +%Y%m%d)-001"

# Create worktrees for parallel work
git worktree add "../${PROJECT_ROOT##*/}-api" "feat/${FEATURE}-api"
git worktree add "../${PROJECT_ROOT##*/}-ui" "feat/${FEATURE}-ui"

# Create session directory in main worktree
mkdir -p ".tmp/worktree-session/${SESSION_ID}"
```

Directory structure:

```
/parent-directory/
├── project/                    # Main worktree (develop)
│   └── .tmp/worktree-session/
│       └── ws-20240115-001/    # Session coordination files
├── project-api/                # Worktree for API work
└── project-ui/                 # Worktree for UI work
```

### Step 3: Initialize Session Files

Create coordination files in main worktree:

#### manifest.md

```markdown
# Worktree Session: [Feature Name]

## Session Info

- **ID:** ws-YYYYMMDD-NNN
- **Created:** YYYY-MM-DD HH:MM
- **Feature:** [Feature description]
- **Base Branch:** develop

## Worktrees

| Worktree | Path | Branch | Agent | Status |
|----------|------|--------|-------|--------|
| Main | /project | develop | - | Coordinator |
| API | /project-api | feat/xxx-api | Agent 1 | Active |
| UI | /project-ui | feat/xxx-ui | Agent 2 | Active |

## Task Assignments

### Agent 1 (API Worktree)
- [ ] Implement search service
- [ ] Create API endpoints
- [ ] Write API tests

### Agent 2 (UI Worktree)
- [ ] Create SearchBar component
- [ ] Implement useSearch hook
- [ ] Write component tests

## Shared Resources

### Shared Files (Coordinate Before Editing)

| File | Owner | Purpose |
|------|-------|---------|
| types/search.ts | Agent 1 | Type definitions |
| constants/search.ts | Shared | Constants |

### Coordination Protocol

1. Check locks before editing shared files
2. Create lock if editing shared file
3. Update progress.md after completing tasks
4. Remove lock when done with shared file
```

#### progress.md

```markdown
# Progress Tracker

## Last Updated: YYYY-MM-DD HH:MM

## Agent 1 (API)

### Completed
- [x] Task 1 - HH:MM

### In Progress
- [ ] Task 2 (started HH:MM)

### Blocked
- None

## Agent 2 (UI)

### Completed
- [x] Task 1 - HH:MM

### In Progress
- [ ] Task 2 (started HH:MM)

### Blocked
- Waiting for types/search.ts update from Agent 1

## Coordination Events

| Time | Agent | Event |
|------|-------|-------|
| HH:MM | Agent 1 | Started work on API |
| HH:MM | Agent 2 | Started work on UI |
| HH:MM | Agent 1 | Updated types/search.ts |
| HH:MM | Agent 2 | Unblocked, continuing |
```

#### shared-context.md

```markdown
# Shared Context

## Decisions Made

### Naming Conventions
- Search params: `SearchParams` interface
- Search results: `SearchResult<T>` generic

### API Design
- Endpoint: `GET /api/search`
- Query params: `q`, `filters`, `page`, `limit`

### Component Patterns
- Use React Query for data fetching
- Use Zod for validation

## Type Definitions

```typescript
// Agreed upon interfaces
interface SearchParams {
  query: string;
  filters: SearchFilters;
  page: number;
  limit: number;
}

interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
```

## Notes for Other Agents

### From Agent 1
- API returns 400 for invalid filters, handle in UI

### From Agent 2
- Need `isLoading` state in API response
```

### Step 4: Lock Management

#### Creating a Lock

```bash
# Before editing shared file
LOCK_FILE=".tmp/worktree-session/${SESSION_ID}/locks/types-search.lock"
mkdir -p "$(dirname "$LOCK_FILE")"

cat > "$LOCK_FILE" << EOF
# Lock: types/search.ts

- Agent: Agent 1
- Worktree: $(pwd)
- Since: $(date -Iseconds)
- Reason: Adding new SearchFilters interface
- ETA: 10 minutes
EOF
```

#### Checking for Locks

```bash
# Before editing, check if lock exists
if [ -f "$LOCK_FILE" ]; then
  echo "File is locked:"
  cat "$LOCK_FILE"
  echo "Please wait or coordinate with the locking agent."
  exit 1
fi
```

#### Removing a Lock

```bash
# After done editing
rm "$LOCK_FILE"

# Update progress
echo "| $(date +%H:%M) | Agent 1 | Released lock on types/search.ts |" >> \
  ".tmp/worktree-session/${SESSION_ID}/progress.md"
```

### Step 5: Agent Communication

Agents communicate via markdown files:

#### Sending a Message

```bash
# Agent 1 sending message to Agent 2
cat >> ".tmp/worktree-session/${SESSION_ID}/messages.md" << EOF

## Message from Agent 1 to Agent 2
**Time:** $(date -Iseconds)

Types have been updated. You can now use:
- \`SearchFilters\` - for filter parameters
- \`PriceRange\` - for price filtering

Ready to unblock your UI work.

---
EOF
```

#### Checking for Messages

Agents should periodically check `messages.md` and `progress.md`.

### Step 6: Synchronization Points

Define sync points where agents must coordinate:

```markdown
## Synchronization Points

### Sync 1: Types Complete
- **When:** Agent 1 finishes types/search.ts
- **Action:** Agent 2 can start using types
- **Signal:** Agent 1 updates progress.md

### Sync 2: API Ready
- **When:** Agent 1 finishes API endpoint
- **Action:** Agent 2 can test with real API
- **Signal:** Agent 1 posts API endpoint details

### Sync 3: Integration
- **When:** Both agents complete
- **Action:** Create integration PR
- **Signal:** Both mark tasks complete in progress.md
```

### Step 7: Cleanup

After feature is complete:

```bash
# Remove worktrees
git worktree remove ../project-api
git worktree remove ../project-ui

# Archive session (optional)
mv ".tmp/worktree-session/${SESSION_ID}" \
   ".tmp/worktree-session/archive/${SESSION_ID}"

# Or delete session
rm -rf ".tmp/worktree-session/${SESSION_ID}"
```

## Output Format

When setting up a worktree session, produce:

```markdown
# Worktree Session Setup Complete

## Session ID: ws-YYYYMMDD-NNN

## Worktrees Created

| Worktree | Path | Branch |
|----------|------|--------|
| API | /path/to/project-api | feat/xxx-api |
| UI | /path/to/project-ui | feat/xxx-ui |

## Session Files

- Manifest: .tmp/worktree-session/ws-.../manifest.md
- Progress: .tmp/worktree-session/ws-.../progress.md
- Context: .tmp/worktree-session/ws-.../shared-context.md

## Agent Instructions

### Agent 1 (API Worktree)
1. cd /path/to/project-api
2. Check .tmp/worktree-session/.../manifest.md for tasks
3. Update progress.md as you complete tasks
4. Lock shared files before editing

### Agent 2 (UI Worktree)
1. cd /path/to/project-ui
2. Check .tmp/worktree-session/.../manifest.md for tasks
3. Update progress.md as you complete tasks
4. Check locks before editing shared files

## Coordination Commands

```bash
# Check progress
cat .tmp/worktree-session/ws-.../progress.md

# Check locks
ls .tmp/worktree-session/ws-.../locks/

# Send message
echo "Message" >> .tmp/worktree-session/ws-.../messages.md
```
```

## Examples

### Example: Two-Agent API/UI Split

```markdown
# Worktree Setup: Property Search

## Session: ws-20240115-001

## Commands Executed

```bash
git checkout develop
git checkout -b feat/search-types
# Add base types, commit, push

git checkout -b feat/search-api
git worktree add ../myapp-api feat/search-api

git checkout feat/search-types
git checkout -b feat/search-ui
git worktree add ../myapp-ui feat/search-ui
```

## Agent Assignments

### Agent 1: /myapp-api
Tasks:
1. Implement SearchService
2. Create /api/search endpoint
3. Add validation middleware
4. Write API tests

### Agent 2: /myapp-ui
Tasks:
1. Create SearchBar component
2. Implement useSearch hook
3. Add loading/error states
4. Write component tests

## Shared Files Protocol

- `types/search.ts`: Agent 1 owns, Agent 2 reads
- `constants/api.ts`: Agent 1 owns
- Both update progress.md independently
```

## Tips

1. **Session Files Location:** Always in main worktree, accessible to all
2. **Lock Granularity:** Lock at file level, not directory
3. **Progress Updates:** Update after each significant task
4. **Message Checking:** Check messages.md every 15-30 minutes
5. **Conflict Prevention:** Define clear ownership of files upfront

## Troubleshooting

### Worktree Not Syncing
```bash
# In worktree, fetch and rebase
git fetch origin
git rebase origin/develop
```

### Lock Stale
```bash
# Check if lock is old (>1 hour)
# If agent is not responding, remove lock
rm .tmp/worktree-session/.../locks/stale.lock
```

### Need to Switch Worktree Branches
```bash
# Can't switch if there are uncommitted changes
git stash
git checkout other-branch
git stash pop
```
