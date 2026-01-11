import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { getSourceAiDir } from '../utils/paths.js';

interface UpgradeOptions {
  dir: string;
  force: boolean;
}

/**
 * Check if file exists
 */
function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Copy file if source exists and target doesn't (or force)
 */
function copyIfNeeded(source: string, target: string, force: boolean): boolean {
  if (!fs.existsSync(source)) return false;
  if (fs.existsSync(target) && !force) return false;
  
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return true;
}

/**
 * Upgrade to v2 structure
 */
async function upgradeToV2(options: UpgradeOptions): Promise<void> {
  const projectDir = options.dir;
  const projectAiDir = path.join(projectDir, '.ai');
  const sourceAiDir = getSourceAiDir();
  
  // Check if .ai exists
  if (!fs.existsSync(projectAiDir)) {
    console.log('❌ No .ai/ directory found. Run `ai-cowork init` first.\n');
    return;
  }

  console.log('🔄 Upgrading to ai-cowork v2 structure...\n');

  const changes: string[] = [];

  // 1. Add CONTEXT.md if not exists
  const contextMdPath = path.join(projectAiDir, 'CONTEXT.md');
  const sourceContextMd = path.join(sourceAiDir, 'CONTEXT.md');
  
  if (!fileExists(contextMdPath) || options.force) {
    if (fileExists(sourceContextMd)) {
      fs.copyFileSync(sourceContextMd, contextMdPath);
      changes.push('✅ Added .ai/CONTEXT.md (entry point)');
    }
  } else {
    changes.push('⏭️  .ai/CONTEXT.md already exists (skipped)');
  }

  // 2. Add config.json if not exists
  const configPath = path.join(projectAiDir, 'config.json');
  const sourceConfig = path.join(sourceAiDir, 'config.json');
  
  if (!fileExists(configPath) || options.force) {
    if (fileExists(sourceConfig)) {
      fs.copyFileSync(sourceConfig, configPath);
      changes.push('✅ Added .ai/config.json (configuration)');
    }
  } else {
    changes.push('⏭️  .ai/config.json already exists (skipped)');
  }

  // 3. Create rules/ directory and copy rules
  const rulesDir = path.join(projectAiDir, 'rules');
  const sourceRulesDir = path.join(sourceAiDir, 'rules');
  
  if (fileExists(sourceRulesDir)) {
    fs.mkdirSync(rulesDir, { recursive: true });
    
    const rules = fs.readdirSync(sourceRulesDir).filter(f => f.endsWith('.md'));
    let copiedRules = 0;
    
    for (const rule of rules) {
      const targetPath = path.join(rulesDir, rule);
      if (!fileExists(targetPath) || options.force) {
        fs.copyFileSync(path.join(sourceRulesDir, rule), targetPath);
        copiedRules++;
      }
    }
    
    if (copiedRules > 0) {
      changes.push(`✅ Added ${copiedRules} rules to .ai/rules/`);
    } else {
      changes.push('⏭️  .ai/rules/ already up to date (skipped)');
    }
  }

  // 4. Create commands/ directory and copy commands
  const commandsDir = path.join(projectAiDir, 'commands');
  const sourceCommandsDir = path.join(sourceAiDir, 'commands');
  
  if (fileExists(sourceCommandsDir)) {
    fs.mkdirSync(commandsDir, { recursive: true });
    
    const commands = fs.readdirSync(sourceCommandsDir).filter(f => f.endsWith('.md'));
    let copiedCommands = 0;
    
    for (const cmd of commands) {
      const targetPath = path.join(commandsDir, cmd);
      if (!fileExists(targetPath) || options.force) {
        fs.copyFileSync(path.join(sourceCommandsDir, cmd), targetPath);
        copiedCommands++;
      }
    }
    
    if (copiedCommands > 0) {
      changes.push(`✅ Added ${copiedCommands} commands to .ai/commands/`);
    } else {
      changes.push('⏭️  .ai/commands/ already up to date (skipped)');
    }
  }

  // 5. Update .gitignore
  const gitignorePath = path.join(projectDir, '.gitignore');
  const contextLocalPattern = 'CONTEXT.local.md';
  
  if (fileExists(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    if (!gitignoreContent.includes(contextLocalPattern)) {
      fs.appendFileSync(gitignorePath, `\n# ai-cowork local context\n${contextLocalPattern}\n`);
      changes.push('✅ Added CONTEXT.local.md to .gitignore');
    }
  }

  // Print summary
  console.log('Changes made:\n');
  changes.forEach(c => console.log(`  ${c}`));

  console.log('\n📦 Upgrade complete!\n');
  console.log('New v2 features:');
  console.log('  • .ai/CONTEXT.md - Main entry point (always loaded)');
  console.log('  • .ai/config.json - Unified configuration');
  console.log('  • .ai/rules/ - Conditional rules (auto-applied by file type)');
  console.log('  • .ai/commands/ - Custom slash commands');
  console.log('\nSmart Loading:');
  console.log('  • AI agents now load context based on task type');
  console.log('  • Rules auto-apply when working with matching files');
  console.log('  • Keywords like "ultrawork" trigger specialized modes');
  console.log('\nRun `ai-cowork sync all` to update tool-specific configs.');
}

/**
 * Show current version and structure
 */
function showStatus(projectDir: string): void {
  const projectAiDir = path.join(projectDir, '.ai');
  
  console.log('📊 ai-cowork Status\n');
  
  if (!fs.existsSync(projectAiDir)) {
    console.log('❌ No .ai/ directory found');
    console.log('   Run `ai-cowork init` to set up\n');
    return;
  }

  // Check structure version
  const hasContextMd = fs.existsSync(path.join(projectAiDir, 'CONTEXT.md'));
  const hasConfigJson = fs.existsSync(path.join(projectAiDir, 'config.json'));
  const hasRulesDir = fs.existsSync(path.join(projectAiDir, 'rules'));
  const hasCommandsDir = fs.existsSync(path.join(projectAiDir, 'commands'));
  
  const isV2 = hasContextMd && hasConfigJson && hasRulesDir;
  
  console.log(`Version: ${isV2 ? 'v2 (Smart Loading)' : 'v1 (Legacy)'}`);
  console.log('');
  
  console.log('Structure:');
  console.log(`  ${hasContextMd ? '✅' : '❌'} CONTEXT.md (entry point)`);
  console.log(`  ${hasConfigJson ? '✅' : '❌'} config.json (configuration)`);
  console.log(`  ${hasRulesDir ? '✅' : '❌'} rules/ (conditional rules)`);
  console.log(`  ${hasCommandsDir ? '✅' : '❌'} commands/ (slash commands)`);
  console.log(`  ${fs.existsSync(path.join(projectAiDir, 'context')) ? '✅' : '❌'} context/ (standards & workflows)`);
  console.log(`  ${fs.existsSync(path.join(projectAiDir, 'skills')) ? '✅' : '❌'} skills/ (reusable skills)`);
  console.log(`  ${fs.existsSync(path.join(projectAiDir, 'agents')) ? '✅' : '❌'} agents/ (AI agents)`);
  console.log(`  ${fs.existsSync(path.join(projectAiDir, 'stacks')) ? '✅' : '❌'} stacks/ (tech stack configs)`);
  
  if (!isV2) {
    console.log('\n💡 Upgrade to v2 for smart context loading:');
    console.log('   ai-cowork upgrade');
  }
  
  console.log('');
}

/**
 * Register upgrade command
 */
export function registerUpgradeCommand(program: Command): void {
  program
    .command('upgrade')
    .description('Upgrade to ai-cowork v2 structure with smart loading')
    .option('-d, --dir <path>', 'Target project directory', process.cwd())
    .option('-f, --force', 'Overwrite existing files', false)
    .action(async (options: UpgradeOptions) => {
      await upgradeToV2(options);
    });

  program
    .command('status')
    .description('Show ai-cowork status and version')
    .option('-d, --dir <path>', 'Target project directory', process.cwd())
    .action((options) => {
      showStatus(options.dir);
    });
}
