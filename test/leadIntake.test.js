import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { extractLeadProfile, getLeadProgress, getNextIntakeReply } from "../src/leadIntake.js";

describe("lead intake", () => {
  it("asks one missing question at a time", () => {
    const reply = getNextIntakeReply({
      language: "en",
      messages: [{ role: "user", content: "I need a landing page for a mechanical device." }],
    });

    assert.match(reply, /full name/i);
  });

  it("extracts structured lead details from the conversation", () => {
    const messages = [
      { role: "user", content: "I need a landing page for a mechanical device." },
      { role: "assistant", content: "What should this project help your business achieve?" },
      { role: "user", content: "Generate quote requests from builders." },
      { role: "assistant", content: "What is your full name?" },
      { role: "user", content: "Adam Builder" },
      { role: "assistant", content: "What email should the team use to contact you?" },
      { role: "user", content: "adam@example.com" },
      { role: "assistant", content: "What phone number should the team use?" },
      { role: "user", content: "+212 600 000000" },
    ];

    const profile = extractLeadProfile(messages, "en");

    assert.equal(profile.serviceRequested, "Landing page");
    assert.equal(profile.projectGoal, "Generate quote requests from builders.");
    assert.equal(profile.name, "Adam Builder");
    assert.equal(profile.email, "adam@example.com");
    assert.equal(profile.phone, "+212 600 000000");
    assert.equal(profile.leadCategory, "landing-page");
  });

  it("tracks progress toward a complete dashboard profile", () => {
    const profile = extractLeadProfile(
      [
        { role: "user", content: "I need an e-commerce store." },
        { role: "assistant", content: "What is your full name?" },
        { role: "user", content: "Sara Client" },
      ],
      "en",
    );
    const progress = getLeadProgress(profile);

    assert.ok(progress.progress > 0);
    assert.ok(progress.missing.includes("email"));
  });
});
