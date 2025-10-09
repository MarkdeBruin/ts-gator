import { setUser } from "../config.js";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  const username = args[0];
  
  if (!username) {
    throw new Error(`Username required: ${cmdName} <name>`);
  }

  setUser(username);
  console.log(`Current user set to: ${username}`);
}