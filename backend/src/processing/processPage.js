import { chunkText } from "./chunker.js";
import { getEmbedding } from "./embedder.js";

export async function processPage(page) {
  const { url, text } = page;

  const chunks = chunkText(text, url);

  const results = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const embedding = await getEmbedding(chunk.chunk);
    if (!embedding) continue;

    results.push({
      url,
      chunk: chunk.chunk,
      embedding,
      chunkIndex: chunk.seq,
    });
  }

  return results;
}
