import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeLeadInput } from "../src/leadStore.js";

describe("lead store", () => {
  it("normalizes a client lead before saving", () => {
    const lead = normalizeLeadInput({
      language: "fr",
      name: "  Samir  ",
      email: " samir@example.com ",
      phone: "  +212 600 000000 ",
      projectType: " Site web ",
      projectGoal: " Sell services ",
      budgetRange: " 10k-20k ",
      timeline: " next month ",
      status: "contacted",
      messages: [
        { role: "user", content: "I need a website" },
        { role: "assistant", content: "What is the goal?" },
        { role: "system", content: "ignore me" },
      ],
    });

    assert.equal(lead.language, "fr");
    assert.equal(lead.name, "Samir");
    assert.equal(lead.email, "samir@example.com");
    assert.equal(lead.phone, "+212 600 000000");
    assert.equal(lead.projectType, "Site web");
    assert.equal(lead.projectGoal, "Sell services");
    assert.equal(lead.budgetRange, "10k-20k");
    assert.equal(lead.timeline, "next month");
    assert.equal(lead.status, "contacted");
    assert.deepEqual(lead.messages, [
      { role: "user", content: "I need a website" },
      { role: "assistant", content: "What is the goal?" },
    ]);
  });

  it("requires contact details or project details", () => {
    assert.throws(() => normalizeLeadInput({ language: "en", messages: [] }), /at least one contact or project detail/i);
  });
});
