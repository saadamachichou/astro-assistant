import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import { loadEnvFile } from "../src/env.js";

describe("env loader", () => {
  it("loads local env values without overriding existing process env", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "astro-env-"));
    const filePath = path.join(directory, ".env");

    process.env.ASTRO_EXISTING = "keep";
    delete process.env.ASTRO_DATABASE_URL;

    writeFileSync(
      filePath,
      [
        "ASTRO_DATABASE_URL='postgres://postgres:postgres@localhost:5432/astro_assistant'",
        "ASTRO_EXISTING=replace",
      ].join("\n"),
      "utf8",
    );

    loadEnvFile(filePath);

    assert.equal(
      process.env.ASTRO_DATABASE_URL,
      "postgres://postgres:postgres@localhost:5432/astro_assistant",
    );
    assert.equal(process.env.ASTRO_EXISTING, "keep");

    delete process.env.ASTRO_EXISTING;
    delete process.env.ASTRO_DATABASE_URL;
    rmSync(directory, { recursive: true, force: true });
  });
});
