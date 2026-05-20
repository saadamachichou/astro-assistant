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

  it("gives first-time detailed project requests a fast starter", () => {
    const reply = getFastReply({
      language: "en",
      messages: [
        {
          role: "user",
          content:
            "Our operation has several unusual approval paths across teams, exceptions for different client categories, monthly reporting needs, and legacy spreadsheet imports that need careful analysis.",
        },
      ],
    });

    assert.match(reply, /first step/i);
  });

  it("lets later unmatched follow-ups go to the model", () => {
    const reply = getFastReply({
      language: "en",
      messages: [
        { role: "user", content: "I have a project idea." },
        { role: "assistant", content: "What problem should this project solve first?" },
        { role: "user", content: "The rules are unusual and need deeper reasoning." },
      ],
    });

    assert.equal(reply, "");
  });

  it("guides early idea questions quickly", () => {
    const reply = getFastReply({
      language: "en",
      messages: [{ role: "user", content: "I have an idea but I am not sure where to start." }],
    });

    assert.match(reply, /first step/i);
  });
});
