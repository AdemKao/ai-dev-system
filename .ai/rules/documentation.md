---
paths:
  - "**/*.md"
  - "**/docs/**"
  - "**/README*"
  - "**/CHANGELOG*"
description: Documentation writing rules
priority: 5
---

# Documentation Rules

> Auto-applied when working with Markdown or documentation files

## Document Structure

```markdown
# Main Title (H1 - only one)

> Short description (one sentence)

## Major Section (H2)

### Subsection (H3)

Content...
```

## README Required Elements

| Section | Purpose |
|---------|---------|
| Title + Description | What the project is |
| Installation | How to get started |
| Usage | Basic examples |
| API/Config | Detailed reference |
| Contributing | How to participate |
| License | Legal terms |

## Code Blocks

Always specify language:

````markdown
```typescript
const greeting = "Hello";
```
````

## Table Format

```markdown
| Field | Description | Default |
|-------|-------------|---------|
| name | The name | - |
| age  | The age | 0 |
```

## Lists

```markdown
## Unordered List
- Item one
- Item two
  - Sub-item

## Ordered List
1. Step one
2. Step two
3. Step three
```

## Callouts

```markdown
> **Note**: General tip

> **Warning**: Warning message

> **Important**: Important information
```

## Links

```markdown
## Inline Links
See the [documentation](./docs/README.md)

## Reference Links
See the [documentation][docs-link]

[docs-link]: ./docs/README.md
```

## Tone

- Use active voice
- Be concise and direct
- Avoid excessive jargon
- Provide examples
