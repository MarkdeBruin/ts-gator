import { readConfig } from "../config";
import { getUserByName } from "../lib/db/queries/users";
import { getFeedByUrl } from "../lib/db/queries/feed";
import { createFeedFollow } from "../lib/db/queries/feedFollows";

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
