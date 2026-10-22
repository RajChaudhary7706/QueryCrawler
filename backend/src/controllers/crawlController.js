import { crawlWebsite } from "../crawler/crawl.js";
import { v4 as uuidv4 } from "uuid";
import { processCrawledPages } from "../utils/processCrawledPages.js";

export const startCrawlProcess = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ success: false, error: "A URL is required" });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: "Enter a valid URL" });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        error: "Only HTTP and HTTPS URLs can be crawled",
      });
    }

    console.log("Starting crawl pipeline for:", url);

    // Create unique session ID
    const sessionId = uuidv4();
    console.log("Generated session ID:", sessionId);

    // Crawl
    const pages = await crawlWebsite(parsedUrl.toString(), 20);
    console.log(`Crawled pages: ${pages.length}`);

    // Process pages (chunk → embed → store)
    const result = await processCrawledPages(pages, sessionId);

    // Final response
    return res.json({
      success: true,
      message: "Crawling + embedding + storing completed!",
      sessionId,
      pagesCrawled: pages.length,
      ...result,
    });

  } catch (err) {
    next(err);
  }
};
