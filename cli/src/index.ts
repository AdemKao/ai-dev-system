import { Command } from "commander";
import { init } from "./commands/init.js";
import { list } from "./commands/list.js";
import { update } from "./commands/update.js";
import { add } from "./commands/add.js";
import { registerSyncCommand } from "./commands/sync.js";
import { registerUpgradeCommand } from "./commands/upgrade.js";

const program = new Command();

program
  .name("ai-cowork")
  .description("AI Cowork - Cross-stack AI development workflow system")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize ai-cowork in a project")
  .option(
    "-s, --stack <stack>",
    "Technology stack (react-typescript, php-laravel, node-express, none)"
  )
  .option(
    "-a, --ai <tool>",
    "AI tool bridge (claude, opencode, cursor, agent, all)",
    "all"
  )
  .option("-d, --dir <directory>", "Target directory", ".")
  .option("--no-bridge", "Skip creating bridge directories")
  .option(
    "-y, --yes",
    "Skip prompts, use defaults (no stack-specific files if undetected)"
  )
  .action(init);

program
  .command("list")
  .description(
    "List available stacks, skills, agents, workflows, and standards"
  )
  .option(
    "-t, --type <type>",
    "Filter by type (stacks, skills, agents, workflows, standards)"
  )
  .action(list);

program
  .command("update")
  .description("Update ai-cowork to latest version")
  .option("-s, --stack <stack>", "Update specific stack only")
  .option("-f, --force", "Force update (overwrite local changes)")
  .action(update);

program
  .command("add")
  .description("Add a specific stack or skill to existing project")
  .argument("<type>", "Type to add (stack, skill)")
  .argument("<name>", "Name of stack or skill")
  .action(add);

// Register sync subcommands
registerSyncCommand(program);

// Register upgrade and status commands
registerUpgradeCommand(program);

program.parse();
