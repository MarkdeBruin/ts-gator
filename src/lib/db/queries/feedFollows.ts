import { db } from "..";
import { feedFollows, feeds, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ userId: userId, feedId: feedId })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedId: feedFollows.feedId,
      userId: feedFollows.userId,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return result;
}
