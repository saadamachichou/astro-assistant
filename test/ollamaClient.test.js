import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildOllamaPayload } from "../src/ollamaClient.js";

describe("ollama client", () => {
  it("builds a non-streaming chat payload for the selected model", () => {
    const payload = buildOllamaPayload({
      model: "qwen2.5:7b",
      messages: [
        { role: "system", content: "You are Astro Assistant." },
        { role: "user", content: "Do you build websites?" },
      ],
    });

    assert.equal(payload.model, "qwen2.5:7b");
    assert.equal(payload.stream, false);
    assert.deepEqual(payload.messages, [
      { role: "system", content: "You are Astro Assistant." },
      { role: "user", content: "Do you build websites?" },
    ]);
    assert.equal(payload.keep_alive, "30m");
    assert.equal(typeof payload.options.temperature, "number");
    assert.ok(payload.options.temperature <= 0.4);
  });

  it("can build a streaming chat payload with faster prototype limits", () => {
    const payload = buildOllamaPayload({
      model: "qwen2.5:7b",
      messages: [{ role: "user", content: "Hello" }],
      stream: true,
    });

    assert.equal(payload.stream, true);
    assert.ok(payload.options.num_ctx <= 1024);
    assert.ok(payload.options.num_predict <= 64);
  });

  it("allows shorter replies for warmup and speed-sensitive calls", () => {
    const payload = buildOllamaPayload({
      model: "qwen2.5:7b",
      messages: [{ role: "user", content: "Ready?" }],
      numPredict: 4,
    });

    assert.equal(payload.options.num_predict, 4);
  });
});
