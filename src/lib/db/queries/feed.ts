import { db } from "..";
import { feeds, users } from "../schema.js";
import { eq } from "drizzle-orm";

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

export async function getAllFeedsWithUsers() {
  const result = await db
    .select({
      feedId: feeds.id,
      feedName: feeds.name,
      feedUrl: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .leftJoin(users, eq(feeds.userId, users.id));
  
  return result;
}
