import { fetchFeed } from "../lib/rss/fetchFeed";

export async function handlerAgg(_: string) {
  const feedUrl = "https://www.wagslane.dev/index.xml";
  const feed = await fetchFeed(feedUrl);
  console.log(JSON.stringify(feed, null, 2));
}