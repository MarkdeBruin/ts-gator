import { readConfig } from "../config";
import { getUserByName } from "../lib/db/queries/users";
import { getFeedByUrl } from "../lib/db/queries/feed";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feedFollows";
import { User } from "src/lib/db/schema";

export async function handlerFollow(cmdName: string, ...args: string[]) {
  const feedUrl = args[0];

  if (!feedUrl) {
    throw new Error(`A feed URL is required: ${cmdName} <url>`);
  }

  const currentUserName = readConfig().currentUserName;
  const user = await getUserByName(currentUserName);

  if (!user) {
    throw new Error(`No user logged in. Use the "login <name>" command first`);
  }

  const feed = await getFeedByUrl(feedUrl);

  if (!feed) {
    throw new Error(`Feed not found: ${feedUrl}`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);

  console.log(
    `User ${feedFollow.userName} is now following feed "${feedFollow.feedName}"`,
  );
}

export async function handlerFollowing(cmdName: string) {
  const currentUserName = readConfig().currentUserName;
  const user: User | undefined = await getUserByName(currentUserName);

  if (!user) {
    throw new Error(`No user logged in. Use the "login <name>" command first`);
  }

  const follows = await getFeedFollowsForUser(user.id);

  if (follows.length === 0) {
    console.log(`${user.name} is not following any feeds`);
    return;
  }

  console.log(`${user.name} is following:`);
  for (const follow of follows) {
    console.log(`* ${follow.feedName}`);
  }
}