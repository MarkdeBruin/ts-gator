import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands.js";
import { handlerLogin } from "./commands/commandLogin.js";

function main() {
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Command required: <command> [args...]");
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;

  try {
    runCommand(registry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
}

main();
