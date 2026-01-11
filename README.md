<h1 align="center">🤖 ai-dev-system</h1>

<p align="center">
  <strong>Portable AI Development Workflow System</strong><br>
  <em>Integrate AI coding assistants into your development workflow across any tech stack</em>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT">
  </a>
  <a href="https://opencode.ai">
    <img src="https://img.shields.io/badge/OpenCode-ready-purple?style=flat-square" alt="OpenCode">
  </a>
  <a href="https://claude.ai">
    <img src="https://img.shields.io/badge/Claude%20Code-ready-green?style=flat-square" alt="Claude Code">
  </a>
  <a href="https://cursor.sh">
    <img src="https://img.shields.io/badge/Cursor-ready-blue?style=flat-square" alt="Cursor">
  </a>
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#cli-commands">CLI</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <a href="./README.zh-TW.md">繁體中文</a>
</p>

---

## Why ai-dev-system?

Modern developers use AI coding assistants daily, but face common challenges:

- **Inconsistent AI behavior** across different projects
- **Lost context** when switching between codebases  
- **Repeated prompting** for the same tasks
- **No standard workflow** for AI-assisted development

**ai-dev-system** solves this by providing a **portable, standardized AI workflow** that travels with you across projects and AI tools.

### What it provides:

- 🎯 **Consistent AI Context** - Your coding standards, patterns, and preferences follow every project
- 📚 **Reusable Skills** - Pre-built prompts for code review, debugging, refactoring, and more
- 🏗️ **Stack Templates** - Language/framework-specific standards (React, Laravel, Node.js, etc.)
- 🔄 **AI Tool Sync** - One config, multiple AI tools (OpenCode, Claude Code, Cursor)
- 🔧 **Extensible** - Create custom skills and stacks for your workflow

Perfect for **freelancers**, **consultants**, and **teams** working across multiple tech stacks.

## Features

- ✅ **Multi-Stack Support** - React, Laravel, Node.js, and more (Python, Go, Rust coming soon)
- ✅ **AI Tool Agnostic** - Works with OpenCode, Claude Code, Cursor
- ✅ **Portable Workflows** - Take your AI development patterns across projects
- ✅ **CLI Tool** - Easy project initialization and sync
- ✅ **Extensible** - Create custom stacks, skills, and agents

## Installation

### Using Bun (Recommended)

```bash
# Install globally
bun install -g ai-dev-cli

# Or run directly
bunx ai-dev-cli init
```

### Using npm

```bash
npm install -g ai-dev-cli
```

### From Source

```bash
git clone https://github.com/AdemKao/ai-dev-system.git
cd ai-dev-system/cli
bun install
bun link
```

## Quick Start

### 1. Initialize a Project

```bash
# Navigate to your project
cd your-project

# Initialize with ai-dev-system
ai-dev init

# Or specify a stack
ai-dev init --stack react-typescript
```

This creates a `.ai/` directory with:

```
.ai/
├── context/          # Coding standards and workflows
├── skills/           # Reusable AI skills
├── agents/           # Specialized AI agents
└── stacks/           # Tech stack configurations
```

### 2. Sync to Your AI Tool

```bash
# Sync to OpenCode
ai-dev sync opencode

# Sync to Claude Code
ai-dev sync claude

# Sync to all supported tools
ai-dev sync all
```

### 3. Start Coding with AI

In OpenCode or Claude Code, use your skills:

```
/code-review     # Run code review skill
/debug           # Run debug skill
/commit          # Generate commit message
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `ai-dev init` | Initialize ai-dev-system in a project |
| `ai-dev list` | List available stacks, skills, and agents |
| `ai-dev add stack <name>` | Add a tech stack to your project |
| `ai-dev add skill <name>` | Add a skill to your project |
| `ai-dev sync opencode` | Generate OpenCode configuration |
| `ai-dev sync claude` | Generate Claude Code configuration |
| `ai-dev sync all` | Sync to all AI tools |
| `ai-dev update` | Update ai-dev-system |

## Available Stacks

| Stack | Description | Status |
|-------|-------------|--------|
| `react-typescript` | React + TypeScript + Vite | ✅ Available |
| `php-laravel` | PHP + Laravel | ✅ Available |
| `node-express` | Node.js + Express | ✅ Available |
| `python-fastapi` | Python + FastAPI | 🔜 Coming Soon |
| `go-fiber` | Go + Fiber | 🔜 Coming Soon |
| `rust-axum` | Rust + Axum | 🔜 Coming Soon |

## Available Skills

| Skill | Description |
|-------|-------------|
| `code-review` | Comprehensive code review with checklist |
| `debug` | Systematic debugging approach |
| `commit` | Generate conventional commit messages |
| `refactor` | Code refactoring guidance |
| `documentation` | Documentation generation |
| `feature-implementation` | Feature planning and implementation |
| `ui-ux` | UI/UX development guidelines |

## Project Structure

```
ai-dev-system/
├── .ai/
│   ├── context/           # Core standards and workflows
│   │   ├── core/
│   │   │   ├── standards/ # Code quality, naming, security
│   │   │   └── workflows/ # BDD/TDD, code review, git
│   │   └── index.md       # Context entry point
│   ├── skills/            # Reusable AI skills
│   ├── agents/            # Specialized AI agents
│   ├── stacks/            # Tech stack templates
│   └── templates/         # Project templates
├── cli/                   # CLI tool source
└── docs/                  # Documentation
```

## AI Tool Integration

### OpenCode

After running `ai-dev sync opencode`:

```
.opencode/
├── skill/          # Skills in OpenCode format
├── agent/          # Agents in OpenCode format
├── command/        # Custom commands
└── plugin/         # Hooks and plugins
opencode.json       # Configuration
AGENTS.md           # Project context
```

### Claude Code

After running `ai-dev sync claude`:

```
.claude/
├── skills/         # Skills in Claude format
└── commands/       # Custom commands
CLAUDE.md           # Project context
```

## Key Workflows

### Contract-Driven Development

Design contracts first, implement later:

1. **DBML** → Define database schema
2. **OpenAPI** → Define API specification
3. **Implement** → Build to contracts
4. **Test** → Verify against contracts

### BDD/TDD

Behavior-driven and test-driven development:

- **Frontend**: Component tests → Implementation → E2E tests
- **Backend**: Feature spec → Unit tests → Implementation → Integration tests

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Project                            │
├─────────────────────────────────────────────────────────────┤
│  .ai/                                                       │
│  ├── context/        ← Coding standards & workflows         │
│  ├── skills/         ← Reusable AI prompts                  │
│  ├── agents/         ← Specialized AI agents                │
│  └── stacks/         ← Tech stack configs                   │
├─────────────────────────────────────────────────────────────┤
│                    ai-dev sync                              │
├──────────────┬──────────────┬───────────────────────────────┤
│  .opencode/  │   .claude/   │        (other tools)          │
│  OpenCode    │  Claude Code │         Cursor, etc.          │
└──────────────┴──────────────┴───────────────────────────────┘
```

1. **Initialize** - `ai-dev init` creates `.ai/` with standards and skills
2. **Customize** - Add your stack, modify standards to fit your workflow
3. **Sync** - `ai-dev sync opencode` generates tool-specific configs
4. **Code** - Your AI assistant now follows your standards automatically

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

```bash
# Clone the repository
git clone https://github.com/AdemKao/ai-dev-system.git
cd ai-dev-system

# Install CLI dependencies
cd cli && bun install

# Run in development mode
bun run dev -- --help
```

## License

[MIT](./LICENSE)

---

<p align="center">
  Made with ❤️ for developers who code with AI
</p>
