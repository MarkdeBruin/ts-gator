import { getUserById } from "../lib/db/queries/users";
import type { Feed, User } from "../lib/db/schema";
import { createFeed, getFeeds } from "../lib/db/queries/feed";
import { createFeedFollow } from "src/lib/db/queries/feedFollows";

export async function handlerGetFeeds(_: string) {
  const feeds = await getFeeds();

  if (feeds.length === 0) {
    console.log("No feeds found");
    return;
  }

  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.id}`);
    }
    printFeed(feed, user);
  }
}

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const feedName = args[0];
  const feedUrl = args[1];

  if (!feedName || !feedUrl) {
    throw new Error(`A name and url are required: ${cmdName} <name> <url>`);
  }

  const feed: Feed = await createFeed(feedName, feedUrl, user.id);

  console.log(`Feed created:`);
  printFeed(feed, user);

  const feedFollow = await createFeedFollow(user.id, feed.id);
  console.log(`\n${user.name} is now following: ${feed.name}`);
}

function printFeed(feed: Feed, user: User) {
  console.log(`ID: ${feed.id}`);
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`Added by: ${user.name}`);
  console.log(`Created at: ${feed.createdAt}`);
  console.log(`Updated at: ${feed.updatedAt}`);
  console.log("\n");
}
