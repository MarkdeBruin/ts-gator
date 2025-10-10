import { getUserByName } from "../lib/db/queries/users";
import { readConfig } from "../config";
import type { Feed, User } from "../lib/db/schema";
import { createFeed } from "../lib/db/queries/feed";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  const feedName = args[0];
  const feedUrl = args[1];

  if (!feedName || !feedUrl) {
    throw new Error(`A name and url are required: ${cmdName} <name> <url>`);
  }

  const currentUserName = readConfig().currentUserName;
  const user: User = await getUserByName(currentUserName);

  if (!user) {
    throw new Error(`No user logged in. Use the “login <name>” command first.`);
  }

  const feed: Feed = await createFeed(feedName, feedUrl, user.id);

  printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
  console.log(`Feed created:`);
  console.log(`ID: ${feed.id}`);
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`Added by: ${user.name}`);
  console.log(`Created at: ${feed.createdAt}`);
  console.log(`Updated at: ${feed.updatedAt}`);
}
