import { setUser } from "../config.js";
import { getUserByName } from "../lib/db/queries/users.js";

export async function handlerLogin(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const name = args[0];

  if (!name) {
    throw new Error(`name required: ${cmdName} <name>`);
  }

  const user = await getUserByName(name);
  if (!user) {
    throw new Error(`User "${name}" does not exist. Use the “register <name>” command first`);
  }

  setUser(name);
  console.log(`Current user set to: ${name}`);
}
