import { resetUsers } from "../lib/db/queries/users";

export async function handlerReset(cmdName: string) {
  await resetUsers();
  console.log("Database reset successfully");
}
