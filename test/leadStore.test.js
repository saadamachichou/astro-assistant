import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeLeadInput } from "../src/leadStore.js";

describe("lead store", () => {
  it("normalizes a client lead before saving", () => {
    const lead = normalizeLeadInput({
      language: "fr",
      sessionId: "session-1",
      name: "  Samir  ",
      companyName: " Astro Build ",
      email: " samir@example.com ",
      phone: "  +212 600 000000 ",
      projectType: " Site web ",
      projectGoal: " Sell services ",
      serviceRequested: " Landing page ",
      location: " Casablanca, Morocco ",
      budgetRange: " 10k-20k ",
      timeline: " next month ",
      communicationMethod: " WhatsApp ",
      additionalNotes: " Needs product photos ",
      fileNotes: " https://example.com/brief.pdf ",
      leadCategory: " landing-page ",
      leadProgress: 80,
      status: "contacted",
      messages: [
        { role: "user", content: "I need a website" },
        { role: "assistant", content: "What is the goal?" },
        { role: "system", content: "ignore me" },
      ],
    });

    assert.equal(lead.language, "fr");
    assert.equal(lead.sessionId, "session-1");
    assert.equal(lead.name, "Samir");
    assert.equal(lead.companyName, "Astro Build");
    assert.equal(lead.email, "samir@example.com");
    assert.equal(lead.phone, "+212 600 000000");
    assert.equal(lead.projectType, "Site web");
    assert.equal(lead.projectGoal, "Sell services");
    assert.equal(lead.serviceRequested, "Landing page");
    assert.equal(lead.location, "Casablanca, Morocco");
    assert.equal(lead.budgetRange, "10k-20k");
    assert.equal(lead.timeline, "next month");
    assert.equal(lead.communicationMethod, "WhatsApp");
    assert.equal(lead.additionalNotes, "Needs product photos");
    assert.equal(lead.fileNotes, "https://example.com/brief.pdf");
    assert.equal(lead.leadCategory, "landing-page");
    assert.equal(lead.leadProgress, 80);
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
