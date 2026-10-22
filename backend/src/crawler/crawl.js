import { extractPage } from "./extract.js";
import { normalizeUrl, sanitizeUrl, absoluteUrl, isInternalLink } from "./utils.js";

export async function crawlWebsite(startUrl, maxPages = 20) {
  const root = normalizeUrl(startUrl);
  if (!root) {
    throw new Error("A valid HTTP or HTTPS URL is required");
  }
  const visited = new Set();
  const queue = [root];

  const pages = [];

  while (queue.length > 0 && visited.size < maxPages) {
    const current = queue.shift();

    const cleanUrl = sanitizeUrl(current);
    if (!cleanUrl || visited.has(cleanUrl)) continue;
    visited.add(cleanUrl);

    console.log(`Crawling: ${cleanUrl}`);

    const page = await extractPage(cleanUrl);
    pages.push(page);

    if (!page.success) continue;

    // Process links
    for (const link of page.links) {
      const abs = absoluteUrl(cleanUrl, link);
      const normalized = sanitizeUrl(abs);

      if (
        normalized &&
        !visited.has(normalized) &&
        isInternalLink(root, normalized)
      ) {
        queue.push(normalized);
      }
    }
  }

  return pages;
}
