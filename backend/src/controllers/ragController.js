import { GoogleGenerativeAI } from "@google/generative-ai";
import { getEmbedding } from "../processing/embedder.js";
import { queryVectors } from "../db/queryVectors.js";

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function generateContentWithRetry(model, prompt, attempts = 3) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      lastError = error;
      const status = error.status || error.response?.status;
      const retryable = status === 429 || status === 503;

      if (!retryable || attempt === attempts - 1) break;

      const delay = 1000 * 2 ** attempt;
      console.warn(
        `Gemini returned ${status}; retrying in ${delay}ms (${attempt + 1}/${attempts - 1})`
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

export const answerQuestion = async (req, res, next) => {
  try {
    const { question, sessionId } = req.body;

    if (!question || !sessionId) {
      return res.status(400).json({
        success: false,
        error: "Both 'question' and 'sessionId' are required",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-3-flash-preview",
    });

    const queryEmbedding = await getEmbedding(question);

    // Query Pinecone ONLY inside this session's namespace
    const results = await queryVectors(queryEmbedding, sessionId, 5);

    if (!results || results.length === 0) {
      return res.json({
        success: true,
        answer: "No relevant information was found in this session's website content.",
      });
    }

    const context = results
      .map(
        (match, i) =>
          `Chunk ${i + 1} from ${match.metadata.url}:\n${match.metadata.chunk}`
      )
      .join("\n\n-----\n\n");

    const prompt = `
Use the following website content to answer the question. Prioritize this content.
If the answer is not directly found, infer from structure or related text.
Only say "I don't know based on the website data." if absolutely no relevant information exists.

Website Content:
${context}

Question:
${question}

Answer:
`;

    const result = await generateContentWithRetry(model, prompt);
    const answer = result.response.text();

    return res.json({
      success: true,
      answer,
      contextUsed: results.length,
    });

  } catch (err) {
    console.error(
      "Gemini RAG Error:",
      err.response?.data || err.message || err
    );
    const status = err.status || err.response?.status;
    if (status === 429 || status === 503) {
      err.statusCode = status;
      err.message =
        "Gemini is temporarily unavailable. Please try your question again in a moment.";
    }
    next(err);
  }
};
