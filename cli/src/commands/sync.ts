import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { getSourceAiDir } from '../utils/paths.js';

// OpenCode skill format requires specific frontmatter
interface SkillFrontmatter {
  name: string;
  description: string;
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
}

/**
 * Convert .ai/skills/ to .opencode/skill/ format
 * OpenCode expects: .opencode/skill/<name>/SKILL.md with YAML frontmatter
 */
async function convertSkillToOpenCode(
  sourceSkillPath: string,
  targetDir: string,
  skillName: string
): Promise<void> {
  const sourceFile = path.join(sourceSkillPath, 'SKILL.md');
  if (!fs.existsSync(sourceFile)) return;

  const content = fs.readFileSync(sourceFile, 'utf-8');
  
  // Extract title and description from markdown
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const descMatch = content.match(/^>\s*(.+)$/m);
  
  const title = titleMatch ? titleMatch[1] : skillName;
  const description = descMatch ? descMatch[1] : `${title} skill`;

  // Create OpenCode compatible format with YAML frontmatter
  const openCodeContent = `---
name: ${skillName}
description: ${description}
license: MIT
compatibility: opencode
metadata:
  source: ai-cowork
---

${content}
`;

  const targetSkillDir = path.join(targetDir, skillName);
  fs.mkdirSync(targetSkillDir, { recursive: true });
  fs.writeFileSync(path.join(targetSkillDir, 'SKILL.md'), openCodeContent);
}

/**
 * Convert .ai/agents/ to .opencode/agent/ format
 */
async function convertAgentToOpenCode(
  sourceAgentPath: string,
  targetDir: string,
  agentName: string
): Promise<void> {
  const content = fs.readFileSync(sourceAgentPath, 'utf-8');
  
  // Check if already has frontmatter
  if (content.startsWith('---')) {
    // Already has frontmatter, just copy
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, `${agentName}.md`), content);
    return;
  }

  // Extract description from first line or heading
  const descMatch = content.match(/^#\s+(.+)$/m) || content.match(/^>\s*(.+)$/m);
  const description = descMatch ? descMatch[1] : `${agentName} agent`;

  // Create OpenCode agent format
  const openCodeContent = `---
description: ${description}
model: anthropic/claude-sonnet-4-5
---

${content}
`;

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, `${agentName}.md`), openCodeContent);
}

/**
 * Convert .ai/rules/ to .claude/rules/ format
 */
async function convertRulesToClaude(
  sourceRulesDir: string,
  targetRulesDir: string
): Promise<number> {
  if (!fs.existsSync(sourceRulesDir)) return 0;
  
  fs.mkdirSync(targetRulesDir, { recursive: true });
  
  const rules = fs.readdirSync(sourceRulesDir).filter(f => f.endsWith('.md'));
  
  for (const rule of rules) {
    const content = fs.readFileSync(path.join(sourceRulesDir, rule), 'utf-8');
    fs.writeFileSync(path.join(targetRulesDir, rule), content);
  }
  
  return rules.length;
}

/**
 * Convert .ai/commands/ to target format
 */
async function convertCommands(
  sourceCommandsDir: string,
  targetCommandsDir: string
): Promise<number> {
  if (!fs.existsSync(sourceCommandsDir)) return 0;
  
  fs.mkdirSync(targetCommandsDir, { recursive: true });
  
  const commands = fs.readdirSync(sourceCommandsDir).filter(f => f.endsWith('.md'));
  
  for (const cmd of commands) {
    const content = fs.readFileSync(path.join(sourceCommandsDir, cmd), 'utf-8');
    fs.writeFileSync(path.join(targetCommandsDir, cmd), content);
  }
  
  return commands.length;
}

/**
 * Generate custom commands from skills (fallback)
 */
async function generateCommandsFromSkills(
  sourceSkillsDir: string,
  targetCommandDir: string
): Promise<void> {
  if (!fs.existsSync(sourceSkillsDir)) return;
  
  fs.mkdirSync(targetCommandDir, { recursive: true });

  const skills = fs.readdirSync(sourceSkillsDir).filter(f => 
    fs.statSync(path.join(sourceSkillsDir, f)).isDirectory()
  );

  for (const skill of skills) {
    const skillFile = path.join(sourceSkillsDir, skill, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    const content = fs.readFileSync(skillFile, 'utf-8');
    const descMatch = content.match(/^>\s*(.+)$/m);
    const description = descMatch ? descMatch[1] : `Run ${skill} skill`;

    // Create command that invokes the skill
    const commandContent = `---
description: ${description}
skill: ${skill}
---

Load and execute the ${skill} skill for the current context.

$ARGUMENTS
`;

    fs.writeFileSync(path.join(targetCommandDir, `${skill}.md`), commandContent);
  }
}

/**
 * Generate opencode.json config
 */
function generateOpenCodeConfig(targetDir: string, projectDir: string): void {
  const config = {
    "$schema": "https://opencode.ai/config.json",
    "theme": "opencode",
    "autoupdate": true,
    "share": "manual",
    "instructions": [
      ".ai/CONTEXT.md"
    ],
    "permission": {
      "edit": "allow",
      "write": "allow",
      "bash": "allow",
      "skill": {
        "*": "allow"
      }
    },
    "compaction": {
      "auto": true,
      "prune": true
    },
    "formatter": {
      "prettier": {
        "disabled": false
      }
    }
  };

  fs.writeFileSync(
    path.join(projectDir, 'opencode.json'),
    JSON.stringify(config, null, 2)
  );
}

/**
 * Generate AGENTS.md from CONTEXT.md
 */
function generateAgentsMd(projectDir: string, aiDir: string): void {
  const contextMdPath = path.join(aiDir, 'CONTEXT.md');
  const agentsMdPath = path.join(projectDir, 'AGENTS.md');
  
  // If CONTEXT.md exists, use it as base
  if (fs.existsSync(contextMdPath)) {
    const content = fs.readFileSync(contextMdPath, 'utf-8');
    fs.writeFileSync(agentsMdPath, content);
    return;
  }
  
  // Otherwise generate default
  const projectName = path.basename(projectDir);
  const content = `# ${projectName}

## Project Overview

[Brief description of the project]

## Tech Stack

[List the main technologies used]

## Development Commands

\`\`\`bash
# Install dependencies
npm install  # or bun install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
\`\`\`

## AI Context

This project uses ai-cowork for AI-assisted development.

### Smart Loading

Load only what you need:
- \`.ai/CONTEXT.md\` - Main entry point
- \`.ai/rules/\` - Auto-applied based on file type
- \`.ai/context/\` - Standards and workflows

### Available Resources
- \`.ai/skills/\` - Reusable AI skills
- \`.ai/agents/\` - Specialized AI agents
- \`.ai/commands/\` - Custom slash commands
`;

  if (!fs.existsSync(agentsMdPath)) {
    fs.writeFileSync(agentsMdPath, content);
  }
}

/**
 * Generate CLAUDE.md from CONTEXT.md
 */
function generateClaudeMd(projectDir: string, aiDir: string): void {
  const contextMdPath = path.join(aiDir, 'CONTEXT.md');
  const claudeMdPath = path.join(projectDir, 'CLAUDE.md');
  
  // If CONTEXT.md exists, use it as base
  if (fs.existsSync(contextMdPath)) {
    const content = fs.readFileSync(contextMdPath, 'utf-8');
    fs.writeFileSync(claudeMdPath, content);
    return;
  }
  
  // Otherwise generate default
  const projectName = path.basename(projectDir);
  const skillsDir = path.join(aiDir, 'skills');
  
  const skillsList = fs.existsSync(skillsDir) 
    ? fs.readdirSync(skillsDir)
        .filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory())
        .map(s => `- ${s}`)
        .join('\n') 
    : '- (none)';

  const content = `# ${projectName}

## Project Overview

[Brief description of the project]

## Tech Stack

[List the main technologies used]

## Development Commands

\`\`\`bash
npm install && npm run dev
\`\`\`

## AI Context

This project uses ai-cowork. Smart loading is enabled:

### Entry Point
- \`.ai/CONTEXT.md\` - Main context (auto-loaded)

### Conditional Rules
Rules in \`.claude/rules/\` are auto-loaded based on file patterns.

### Skills
Custom skills available in \`.claude/skills/\`:
${skillsList}

### Loading Principle
**Only load context relevant to the current task. Never preload "just in case".**
`;

  if (!fs.existsSync(claudeMdPath)) {
    fs.writeFileSync(claudeMdPath, content);
  }
}

/**
 * Generate OpenCode plugin template for ai-cowork hooks
 */
function generatePluginTemplate(targetDir: string): void {
  const pluginDir = path.join(targetDir, 'plugin');
  fs.mkdirSync(pluginDir, { recursive: true });

  const pluginContent = `import type { Plugin } from "@opencode-ai/plugin"

/**
 * AI Cowork Plugin
 * 
 * Provides hooks for automatic context loading and smart loading.
 */
export const AiCoworkPlugin: Plugin = async ({ project, client, $, directory }) => {
  // Log plugin initialization
  await client.app.log({
    service: "ai-cowork-plugin",
    level: "info",
    message: "AI Cowork plugin loaded - Smart context loading enabled",
  })

  return {
    // Auto-load CONTEXT.md when session starts
    "session.created": async () => {
      await client.app.log({
        service: "ai-cowork-plugin",
        level: "info",
        message: "Session created - Load .ai/CONTEXT.md for smart context routing",
      })
    },

    // Protect sensitive files
    "tool.execute.before": async (input, output) => {
      const protectedPatterns = [
        ".env",
        "credentials",
        "secrets",
        ".pem",
        ".key",
        "password",
      ]

      if (input.tool === "read") {
        const filePath = output.args.filePath?.toLowerCase() || ""
        for (const pattern of protectedPatterns) {
          if (filePath.includes(pattern)) {
            throw new Error(\`Protected file access denied: \${pattern}\`)
          }
        }
      }
    },

    // Notify on session completion (macOS)
    "session.idle": async () => {
      try {
        await $\`osascript -e 'display notification "Task completed!" with title "OpenCode"'\`
      } catch {
        // Notification failed, ignore (non-macOS or permission issue)
      }
    },

    // Log file edits
    "file.edited": async ({ path }) => {
      await client.app.log({
        service: "ai-cowork-plugin",
        level: "debug",
        message: \`File edited: \${path}\`,
      })
    },
  }
}
`;

  fs.writeFileSync(path.join(pluginDir, 'ai-cowork-hooks.ts'), pluginContent);
}

/**
 * Main sync function for OpenCode
 */
async function syncOpenCode(projectDir: string): Promise<void> {
  const sourceAiDir = getSourceAiDir();
  const projectAiDir = path.join(projectDir, '.ai');
  const openCodeDir = path.join(projectDir, '.opencode');

  // Check if .ai exists in project
  const aiDir = fs.existsSync(projectAiDir) ? projectAiDir : sourceAiDir;
  
  console.log('🔄 Syncing to OpenCode format...\n');

  // 1. Create .opencode directory structure
  fs.mkdirSync(openCodeDir, { recursive: true });
  console.log('📁 Created .opencode/ directory');

  // 2. Convert skills
  const skillsDir = path.join(aiDir, 'skills');
  const targetSkillsDir = path.join(openCodeDir, 'skill');
  
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir).filter(f => 
      fs.statSync(path.join(skillsDir, f)).isDirectory()
    );
    
    for (const skill of skills) {
      await convertSkillToOpenCode(
        path.join(skillsDir, skill),
        targetSkillsDir,
        skill
      );
    }
    console.log(`✅ Converted ${skills.length} skills to .opencode/skill/`);
  }

  // 3. Convert agents
  const agentsDir = path.join(aiDir, 'agents');
  const targetAgentsDir = path.join(openCodeDir, 'agent');
  
  if (fs.existsSync(agentsDir)) {
    const agents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
    
    for (const agent of agents) {
      const agentName = agent.replace('.md', '');
      await convertAgentToOpenCode(
        path.join(agentsDir, agent),
        targetAgentsDir,
        agentName
      );
    }
    console.log(`✅ Converted ${agents.length} agents to .opencode/agent/`);
  }

  // 4. Convert commands (prefer .ai/commands/, fallback to generating from skills)
  const commandsDir = path.join(aiDir, 'commands');
  const targetCommandDir = path.join(openCodeDir, 'command');
  
  if (fs.existsSync(commandsDir)) {
    const count = await convertCommands(commandsDir, targetCommandDir);
    console.log(`✅ Converted ${count} commands to .opencode/command/`);
  } else {
    await generateCommandsFromSkills(skillsDir, targetCommandDir);
    console.log('✅ Generated commands from skills in .opencode/command/');
  }

  // 5. Generate plugin template
  generatePluginTemplate(openCodeDir);
  console.log('✅ Created plugin template .opencode/plugin/ai-cowork-hooks.ts');

  // 6. Generate opencode.json
  generateOpenCodeConfig(openCodeDir, projectDir);
  console.log('✅ Generated opencode.json');

  // 7. Generate AGENTS.md from CONTEXT.md
  generateAgentsMd(projectDir, aiDir);
  console.log('✅ Generated AGENTS.md');

  console.log('\n🎉 OpenCode sync complete!\n');
  console.log('Generated structure:');
  console.log('  .opencode/');
  console.log('  ├── skill/        # Converted skills');
  console.log('  ├── agent/        # Converted agents');
  console.log('  ├── command/      # Commands');
  console.log('  └── plugin/       # Hook templates');
  console.log('  opencode.json     # Configuration');
  console.log('  AGENTS.md         # Project context');
  console.log('\nRun `opencode` to start using!');
}

/**
 * Main sync function for Claude Code
 */
async function syncClaude(projectDir: string): Promise<void> {
  const sourceAiDir = getSourceAiDir();
  const projectAiDir = path.join(projectDir, '.ai');
  const claudeDir = path.join(projectDir, '.claude');

  const aiDir = fs.existsSync(projectAiDir) ? projectAiDir : sourceAiDir;
  
  console.log('🔄 Syncing to Claude Code format...\n');

  // 1. Create .claude directory structure
  fs.mkdirSync(path.join(claudeDir, 'commands'), { recursive: true });
  fs.mkdirSync(path.join(claudeDir, 'skills'), { recursive: true });
  fs.mkdirSync(path.join(claudeDir, 'rules'), { recursive: true });
  fs.mkdirSync(path.join(claudeDir, 'agents'), { recursive: true });
  console.log('📁 Created .claude/ directory');

  // 2. Convert skills
  const skillsDir = path.join(aiDir, 'skills');
  const targetSkillsDir = path.join(claudeDir, 'skills');
  
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir).filter(f => 
      fs.statSync(path.join(skillsDir, f)).isDirectory()
    );
    
    for (const skill of skills) {
      await convertSkillToOpenCode(
        path.join(skillsDir, skill),
        targetSkillsDir,
        skill
      );
    }
    console.log(`✅ Converted ${skills.length} skills to .claude/skills/`);
  }

  // 3. Convert rules (NEW!)
  const rulesDir = path.join(aiDir, 'rules');
  const targetRulesDir = path.join(claudeDir, 'rules');
  const rulesCount = await convertRulesToClaude(rulesDir, targetRulesDir);
  if (rulesCount > 0) {
    console.log(`✅ Converted ${rulesCount} rules to .claude/rules/`);
  }

  // 4. Convert commands
  const commandsDir = path.join(aiDir, 'commands');
  const targetCommandsDir = path.join(claudeDir, 'commands');
  
  if (fs.existsSync(commandsDir)) {
    const count = await convertCommands(commandsDir, targetCommandsDir);
    console.log(`✅ Converted ${count} commands to .claude/commands/`);
  } else {
    await generateCommandsFromSkills(skillsDir, targetCommandsDir);
    console.log('✅ Generated commands from skills in .claude/commands/');
  }

  // 5. Convert agents (NEW!)
  const agentsDir = path.join(aiDir, 'agents');
  const targetAgentsDir = path.join(claudeDir, 'agents');
  
  if (fs.existsSync(agentsDir)) {
    const agents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
    
    for (const agent of agents) {
      const agentName = agent.replace('.md', '');
      await convertAgentToOpenCode(
        path.join(agentsDir, agent),
        targetAgentsDir,
        agentName
      );
    }
    console.log(`✅ Converted ${agents.length} agents to .claude/agents/`);
  }

  // 6. Generate CLAUDE.md from CONTEXT.md
  generateClaudeMd(projectDir, aiDir);
  console.log('✅ Generated CLAUDE.md');

  console.log('\n🎉 Claude Code sync complete!\n');
  console.log('Generated structure:');
  console.log('  .claude/');
  console.log('  ├── skills/       # Converted skills');
  console.log('  ├── rules/        # Conditional rules');
  console.log('  ├── commands/     # Slash commands');
  console.log('  └── agents/       # Custom agents');
  console.log('  CLAUDE.md         # Project context');
  console.log('\nRun `claude` to start using!');
}

/**
 * Register sync command
 */
export function registerSyncCommand(program: Command): void {
  const sync = program
    .command('sync')
    .description('Sync ai-cowork to AI tool formats');

  sync
    .command('opencode')
    .description('Generate .opencode/ configuration for OpenCode')
    .option('-d, --dir <path>', 'Target project directory', process.cwd())
    .action(async (options) => {
      await syncOpenCode(options.dir);
    });

  sync
    .command('claude')
    .description('Generate .claude/ configuration for Claude Code')
    .option('-d, --dir <path>', 'Target project directory', process.cwd())
    .action(async (options) => {
      await syncClaude(options.dir);
    });

  sync
    .command('all')
    .description('Sync to all supported AI tools')
    .option('-d, --dir <path>', 'Target project directory', process.cwd())
    .action(async (options) => {
      await syncOpenCode(options.dir);
      console.log('\n---\n');
      await syncClaude(options.dir);
    });
}
