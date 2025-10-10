import { db } from "..";
import { feeds } from "../schema.js";
import { eq, sql } from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({
      name,
      url,
      userId,
    })
    .returning();

  return result;
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedByUrl(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  return feed;
}

export async function markFeedFetched(feedId: string) {
  const [result] = await db
    .update(feeds)
    .set({
      lastFetchAt: new Date(),
    })
    .where(eq(feeds.id, feedId))
    .returning();
  return result;
}

export async function getNextFeedToFetch() {
  const [result] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchAt} desc nulls first`)
    .limit(1);
  return result;
}
