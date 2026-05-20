import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getGuideStep, selectGuideChoice } from "../src/guidedChoices.js";

describe("guided choices", () => {
  it("starts with outcome-based choices and moves to a more specific website step", () => {
    const firstStep = getGuideStep("en", "project-type");
    const websiteChoice = firstStep.choices.find((choice) => choice.id === "website");

    assert.equal(firstStep.title, "What result do you want?");
    assert.deepEqual(
      firstStep.choices.map((choice) => choice.label),
      ["Get clients", "Sell online", "Automate work", "Launch SaaS", "Fix a project", "Guide me"],
    );
    assert.ok(websiteChoice);

    const selection = selectGuideChoice("project-type", websiteChoice);
    const nextStep = getGuideStep("en", selection.nextStage);

    assert.equal(selection.nextStage, "website-goal");
    assert.equal(selection.leadPatch.projectType, "Website");
    assert.ok(nextStep.choices.some((choice) => choice.id === "business-website"));
    assert.equal(nextStep.choices.some((choice) => choice.id === "website"), false);
  });

  it("falls back to English for unknown languages and keeps French labels when requested", () => {
    assert.equal(getGuideStep("es", "project-type").choices[0].label, "Get clients");
    assert.equal(getGuideStep("fr", "project-type").choices[0].label, "Trouver clients");
  });
});
