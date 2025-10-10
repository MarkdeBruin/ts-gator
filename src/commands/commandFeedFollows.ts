import { getFeedByUrl } from "../lib/db/queries/feed";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feedFollows";
import { User } from "src/lib/db/schema";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const feedUrl = args[0];

  if (!feedUrl) {
    throw new Error(`A feed URL is required: ${cmdName} <url>`);
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

export async function handlerFollowing(cmdName: string, user: User) {
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
