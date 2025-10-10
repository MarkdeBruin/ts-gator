import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands.js";
import { middlewareLoggedIn } from "./commands/commands.js";
import { handlerLogin } from "./commands/commandLogin.js";
import { handlerRegister } from "./commands/commandRegister.js";
import { handlerReset } from "./commands/commandReset.js";
import { handlerUsers } from "./commands/commandUsers.js";
import { handlerAgg } from "./commands/commandAgg.js";
import { handlerAddFeed, handlerGetFeeds } from "./commands/commandFeeds.js";
import {
  handlerFollow,
  handlerFollowing,
  handlerUnfollow,
} from "./commands/commandFeedFollows.js";
import { handlerBrowse } from "./commands/commandBrowse.js";

async function main() {
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerGetFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Command required: <command> [args...]");
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();
