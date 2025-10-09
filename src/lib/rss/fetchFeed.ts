import { XMLParser } from "fast-xml-parser";
import type { RSSFeed, RSSItem } from "./types";

export async function fetchFeed(feedUrl: string): Promise<RSSFeed> {
  const response = await fetch(feedUrl, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch feed: ${response.status} ${response.statusText}`,
    );
  }

  const xmlText = await response.text();
  const parser = new XMLParser();
  const parsed = parser.parse(xmlText);

  const channel = parsed?.rss?.channel;
  if (!channel) throw new Error("Invalid RSS feed: missing <channel>");

  const { title, link, description } = channel;
  if (!title || !link || !description) {
    throw new Error("Invalid RSS feed: missing metadata fields");
  }

  const rawItems = Array.isArray(channel.item) ? channel.item : [];
  const items: RSSItem[] = rawItems.filter(isValidItem).map(normalizeItem);

  return { channel: { title, link, description, item: items } };
}

function isValidItem(item: any): item is RSSItem {
  return (
    typeof item.title === "string" &&
    typeof item.link === "string" &&
    typeof item.description === "string" &&
    typeof item.pubDate === "string"
  );
}

function normalizeItem(item: RSSItem): RSSItem {
  return {
    title: item.title.trim(),
    link: item.link.trim(),
    description: item.description.trim(),
    pubDate: item.pubDate.trim(),
  };
}
