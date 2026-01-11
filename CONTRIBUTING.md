# Contributing to ai-dev-system

Thank you for your interest in contributing to ai-dev-system! This document provides guidelines and information about contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md). We expect all contributors to be respectful and inclusive.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-dev-system.git
   cd ai-dev-system
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/AdemKao/ai-dev-system.git
   ```

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) (v1.0 or higher)
- [Node.js](https://nodejs.org) (v18 or higher)
- [Git](https://git-scm.com)

### Installation

```bash
# Install CLI dependencies
cd cli
bun install

# Link for local development
bun link

# Run in development mode
bun run dev -- --help
```

### Running Tests

```bash
cd cli
bun test
```

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

When creating a bug report, include:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Your environment (OS, Bun/Node version, etc.)

### Suggesting Features

We welcome feature suggestions! Please:
- Check existing issues and discussions first
- Provide a clear use case
- Explain how it benefits the community

### Contributing Code

1. **Find an issue** to work on, or create one
2. **Comment on the issue** to let others know you're working on it
3. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
4. **Make your changes** following our coding standards
5. **Test your changes** thoroughly
6. **Submit a pull request**

### Adding New Skills

To add a new skill:

1. Create a new directory in `.ai/skills/`:
   ```
   .ai/skills/your-skill/
   └── SKILL.md
   ```

2. Follow the skill format:
   ```markdown
   # Your Skill Name
   
   > Brief description of what this skill does.
   
   ## Trigger
   
   - When to use this skill
   
   ## Steps
   
   1. Step one
   2. Step two
   
   ## Output Format
   
   Expected output format...
   ```

### Adding New Stacks

To add a new stack:

1. Create a new directory in `.ai/stacks/`:
   ```
   .ai/stacks/your-stack/
   ├── stack.json
   ├── standards/
   │   └── your-stack.md
   └── skills/
       └── your-skill/
           └── SKILL.md
   ```

2. Define `stack.json`:
   ```json
   {
     "name": "your-stack",
     "displayName": "Your Stack",
     "description": "Description of your stack",
     "languages": ["language"],
     "frameworks": ["framework"],
     "packageManager": "npm|bun|pip|etc"
   }
   ```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update the CHANGELOG.md** with your changes
5. **Fill out the PR template** completely
6. **Request review** from maintainers

### PR Title Format

Use conventional commit format:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `refactor: improve code structure`
- `test: add tests`
- `chore: update dependencies`

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Use explicit types (avoid `any`)
- Use meaningful variable names

### Markdown

- Use ATX-style headers (`#`)
- Use fenced code blocks with language identifiers
- Keep lines under 100 characters when possible

### File Organization

- Keep files focused and small
- Use meaningful file names
- Group related files in directories

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(cli): add sync command for OpenCode integration

fix(skills): correct code-review checklist formatting

docs: update README with installation instructions
```

## Questions?

Feel free to open a [GitHub Issue](https://github.com/AdemKao/ai-dev-system/issues) if you have any questions.

Thank you for contributing! 🎉
