import { createUser, getUserByName } from "../lib/db/queries/users.js";
import { setUser } from "../config.js";

export async function handlerRegister(cmdName: string, ...args: string[]) {
  const name = args[0];
  if (!name) throw new Error(`A name is required: ${cmdName} <name>`);

  const existingUser = await getUserByName(name);
  if (existingUser) throw new Error(`User ${name} already exists`);

  const user = await createUser(name);
  setUser(name);

  console.log("User created:", user);
  console.log(`Current user set to: ${name}`);
}
