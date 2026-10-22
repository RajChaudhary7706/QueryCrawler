import axios from "axios";

// Jina embeddings API
export async function getEmbedding(text) {
  try {
    const response = await axios.post(
      "https://api.jina.ai/v1/embeddings",
      {
        input: text,
        model: "jina-embeddings-v2-base-en",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          "Content-Type": "application/json",
        },
        proxy: process.env.USE_HTTP_PROXY === "true" ? undefined : false,
        timeout: 15000,
      }
    );

    return response.data.data[0].embedding;
  } catch (err) {
    console.error(" Jina Embedding Error:", err.response?.data || err.message);

    throw new Error("Embedding generation failed");
  }
}

export async function getBatchEmbeddings(textArray) {
  try {
    const response = await axios.post(
      "https://api.jina.ai/v1/embeddings",
      {
        input: textArray,
        model: "jina-embeddings-v2-base-en",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          "Content-Type": "application/json",
        },
        proxy: process.env.USE_HTTP_PROXY === "true" ? undefined : false,
        timeout: 35000,
      }
    );

    return response.data.data.map((d) => d.embedding);
  } catch (err) {
    console.error(" Batch Embedding Error:", err.response?.data || err.message);

    throw new Error("Batch embedding failed");
  }
}
