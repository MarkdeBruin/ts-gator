import { readConfig } from "../config";
import { getUserByName } from "../lib/db/queries/users";
import { User } from "../lib/db/schema";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
}

export const middlewareLoggedIn = (handler: UserCommandHandler): CommandHandler => {
  return async (cmdName: string, ...args: string[]) => {
    const currentUserName = readConfig().currentUserName;

    if (!currentUserName) {
      throw new Error(`No user logged in. Use "login <name>" first.`);
    }

    const user = await getUserByName(currentUserName);

    if (!user) {
      throw new Error(`Logged in user "${currentUserName}" not found in DB.`);
    }

    return handler(cmdName, user, ...args);
  };
};

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  await handler(cmdName, ...args);
}
