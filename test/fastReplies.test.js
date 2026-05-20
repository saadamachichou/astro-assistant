import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getFastReply } from "../src/fastReplies.js";

describe("fast replies", () => {
  it("answers common service questions without calling the model", () => {
    const reply = getFastReply({
      language: "en",
      messages: [{ role: "user", content: "What services do you offer?" }],
    });

    assert.match(reply, /websites/i);
    assert.match(reply, /What are you trying to create/);
  });

  it("respects the selected French language", () => {
    const reply = getFastReply({
      language: "fr",
      messages: [{ role: "user", content: "Combien coute un site web ?" }],
    });

    assert.match(reply, /prix/i);
    assert.match(reply, /brief/i);
  });

  it("lets custom longer project details go to the model", () => {
    const reply = getFastReply({
      language: "en",
      messages: [
        {
          role: "user",
          content:
            "I need a custom platform for my team with client accounts, invoice tracking, analytics, and several unusual approval workflows. Can you help me think through the first version?",
        },
      ],
    });

    assert.equal(reply, "");
  });
});
