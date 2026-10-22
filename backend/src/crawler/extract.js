import axios from "axios";
import * as cheerio from "cheerio";

export async function extractPage(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      maxContentLength: 5 * 1024 * 1024,
      // Axios otherwise inherits a broken local proxy configuration in some
      // development environments. Set USE_HTTP_PROXY=true when a proxy is
      // intentionally required.
      proxy: process.env.USE_HTTP_PROXY === "true" ? undefined : false,
      headers: {
        "User-Agent": "Mozilla/5.0 Custom-RAG-Crawler",
      },
    });

    const contentType = response.headers["content-type"] || "";
    if (!contentType.includes("text/html")) {
      throw new Error(`Unsupported content type: ${contentType || "unknown"}`);
    }

    const html = response.data;
    const $ = cheerio.load(html);

    const title = $("title").text().trim() || "No Title";

    // Capture links before stripping navigation and footer elements. Those areas
    // commonly contain the only links to the rest of a site.
    const links = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href) links.push(href);
    });

    // Remove irrelevant elements
    [
      "script",
      "style",
      "nav",
      "footer",
      "header",
      "noscript",
      "svg",
      "img"
    ].forEach((tag) => $(tag).remove());

    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    const headings = [];
    $("h1, h2, h3, h4, h5, h6").each((i, el) => {
      headings.push($(el).text().trim());
    });

    return {
      success: true,
      url,
      title,
      text: bodyText,
      headings,
      links,
    };
  } catch (err) {
    console.error(` Extraction failed at ${url}: ${err.message}`);
    return { success: false, url, text: "", headings: [], links: [] };
  }
}
