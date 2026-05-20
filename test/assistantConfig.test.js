import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildSystemMessage, compactMessages, normalizeMessages } from "../src/assistantConfig.js";

describe("assistant config", () => {
  it("combines the system prompt and knowledge base into one system message", () => {
    const systemMessage = buildSystemMessage({
      systemPrompt: "You are Astro Assistant.",
      knowledgeBase: "ASTROQODELABS builds scalable websites.",
      language: "fr",
    });

    assert.equal(systemMessage.role, "system");
    assert.match(systemMessage.content, /You are Astro Assistant\./);
    assert.match(systemMessage.content, /ASTROQODELABS builds scalable websites\./);
    assert.match(systemMessage.content, /compact company brief/i);
    assert.match(systemMessage.content, /The visitor selected French/);
  });

  it("keeps only valid chat messages with string content", () => {
    const messages = normalizeMessages([
      { role: "system", content: "ignore" },
      { role: "assistant", content: "Hello" },
      { role: "user", content: "Do you build SaaS?" },
      { role: "tool", content: "ignore" },
      { role: "user", content: 123 },
      null,
    ]);

    assert.deepEqual(messages, [
      { role: "assistant", content: "Hello" },
      { role: "user", content: "Do you build SaaS?" },
    ]);
  });

  it("keeps recent history compact for faster local model replies", () => {
    const messages = compactMessages(
      [
        { role: "user", content: "old message" },
        { role: "assistant", content: "old answer" },
        { role: "user", content: "x".repeat(20) },
      ],
      { limit: 2, maxCharacters: 8 },
    );

    assert.deepEqual(messages, [
      { role: "assistant", content: "old answ..." },
      { role: "user", content: "xxxxxxxx..." },
    ]);
  });
});
