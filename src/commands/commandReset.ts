import { deleteAllUsers } from "../lib/db/queries/users";

export async function handlerReset(_: string) {
  await deleteAllUsers();
  console.log("Database reset successfully");
}
