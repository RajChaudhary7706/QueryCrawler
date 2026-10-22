import { Pinecone } from "@pinecone-database/pinecone";

let pineconeClient = null;
let pineconeIndex = null;

export function initPinecone() {
  try {
    if (!pineconeClient) {
      pineconeClient = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      });

      console.log("Pinecone client initialized");
    }

    if (!pineconeIndex) {
      pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX);
      console.log(` Pinecone index selected: ${process.env.PINECONE_INDEX}`);
    }
  } catch (err) {
    console.error("Pinecone initialization failed:", err);
    throw err;
  }
}

export function getPineconeIndex() {
  if (!pineconeIndex) {
    initPinecone();
  }
  return pineconeIndex;
}
