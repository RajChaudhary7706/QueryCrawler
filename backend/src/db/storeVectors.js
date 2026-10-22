import { getPineconeIndex } from "./pinecone.js";

export async function storeVectors(vectors, sessionId) {
  try {
    const index = getPineconeIndex();

    // Store vectors inside a session-specific namespace
    const result = await index.namespace(sessionId).upsert(vectors);

    return {
      success: true,
      result,
      count: vectors.length,
      namespace: sessionId,
    };
  } catch (err) {
    console.error("Pinecone upsert error:", err);
    throw new Error("Failed to upsert vectors to Pinecone");
  }
}
