import { db } from "..";
import { feeds, users } from "../schema.js";

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
