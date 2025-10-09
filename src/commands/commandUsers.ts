import { readConfig } from "src/config";
import { getAllUsers } from "../lib/db/queries/users";

export async function handlerUsers(_: string) {
  const users = await getAllUsers();
  const config = readConfig();

  if (users.length === 0)
    throw new Error(`No users found. First use the “register <name>” command`);

  for (let user of users) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
}
