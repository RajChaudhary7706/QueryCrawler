function cleanText(text) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

function splitIntoSentences(text) {
  return text.match(/[^.!?]+(?:[.!?]+|$)/g)?.map((sentence) => sentence.trim()) || [];
}

function splitLongSentence(sentence, chunkSize) {
  const words = sentence.split(/\s+/).filter(Boolean);
  const parts = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    parts.push(words.slice(i, i + chunkSize).join(" "));
  }

  return parts;
}

export function chunkText(text, url, chunkSize = 700) {
  const cleaned = cleanText(text);
  if (!cleaned) return [];

  const sentences = splitIntoSentences(cleaned).flatMap((sentence) =>
    splitLongSentence(sentence, chunkSize)
  );

  const chunks = [];
  let current = "";
  let tokenCount = 0;
  let seq = 1;

  for (const sentence of sentences) {
    const sentenceTokens = sentence.split(" ").length;

    if (current && tokenCount + sentenceTokens > chunkSize) {
      chunks.push({
        seq,
        url,
        chunk: current.trim(),
        tokens: tokenCount,
      });

      seq++;
      current = sentence;
      tokenCount = sentenceTokens;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
      tokenCount += sentenceTokens;
    }
  }

  if (current.trim().length > 0) {
    chunks.push({
      seq,
      url,
      chunk: current.trim(),
      tokens: tokenCount,
    });
  }

  return chunks;
}
