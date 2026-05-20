export function buildOllamaPayload({ model, messages, stream = false, numPredict = 64 }) {
  return {
    model,
    messages,
    stream,
    keep_alive: "30m",
    options: {
      temperature: 0.25,
      top_p: 0.9,
      num_ctx: 768,
      num_predict: numPredict,
    },
  };
}

export async function chatWithOllama({ baseUrl, model, messages, signal, numPredict }) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildOllamaPayload({ model, messages, stream: false, numPredict })),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data?.message?.content;

  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("Ollama returned an empty assistant message.");
  }

  return content.trim();
}

export async function* streamWithOllama({ baseUrl, model, messages, signal, numPredict }) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildOllamaPayload({ model, messages, stream: true, numPredict })),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed: ${response.status} ${errorText}`);
  }

  if (!response.body) {
    throw new Error("Ollama did not return a readable stream.");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const cleanLine = line.trim();

      if (!cleanLine) {
        continue;
      }

      const data = JSON.parse(cleanLine);
      const content = data?.message?.content;

      if (typeof content === "string" && content.length > 0) {
        yield content;
      }
    }
  }

  const finalLine = buffer.trim();

  if (finalLine) {
    const data = JSON.parse(finalLine);
    const content = data?.message?.content;

    if (typeof content === "string" && content.length > 0) {
      yield content;
    }
  }
}
