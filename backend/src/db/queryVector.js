import { getPineconeIndex } from "./pinecone.js";

export async function queryVectors(queryEmbedding, sessionId, topK = 5) {
  try {
    const index = getPineconeIndex();

    // Query only inside this session's namespace
    const result = await index
      .namespace(sessionId)
      .query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
      });

    return result.matches || [];
  } catch (err) {
    console.error("Pinecone query error:", err);
    throw new Error("Failed to query Pinecone");
  }
}
