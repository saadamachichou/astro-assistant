import pg from "pg";

const { Pool } = pg;
const ALLOWED_ROLES = new Set(["user", "assistant"]);
const ALLOWED_STATUSES = new Set(["new", "contacted", "won", "lost"]);

function cleanText(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => {
      return (
        message &&
        ALLOWED_ROLES.has(message.role) &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
      );
    })
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}

export function normalizeLeadInput(input = {}) {
  const status = cleanText(input.status) || "new";
  const lead = {
    language: input.language === "fr" ? "fr" : "en",
    name: cleanText(input.name),
    email: cleanText(input.email),
    phone: cleanText(input.phone),
    projectType: cleanText(input.projectType),
    projectGoal: cleanText(input.projectGoal),
    budgetRange: cleanText(input.budgetRange),
    timeline: cleanText(input.timeline),
    status: ALLOWED_STATUSES.has(status) ? status : "new",
    messages: normalizeMessages(input.messages),
  };

  const hasUsefulData = [
    lead.name,
    lead.email,
    lead.phone,
    lead.projectType,
    lead.projectGoal,
    lead.budgetRange,
    lead.timeline,
  ].some(Boolean);

  if (!hasUsefulData) {
    throw new Error("Lead needs at least one contact or project detail.");
  }

  return lead;
}

export function createLeadPool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    return null;
  }

  return new Pool({ connectionString });
}

export async function initLeadDatabase(pool) {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured.");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS astro_leads (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      status TEXT NOT NULL DEFAULT 'new',
      language TEXT NOT NULL DEFAULT 'en',
      name TEXT,
      email TEXT,
      phone TEXT,
      project_type TEXT,
      project_goal TEXT,
      budget_range TEXT,
      timeline TEXT,
      messages JSONB NOT NULL DEFAULT '[]'::jsonb,
      source TEXT NOT NULL DEFAULT 'website-widget'
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS astro_leads_created_at_idx
    ON astro_leads (created_at DESC);
  `);
}

function mapLeadRow(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    language: row.language,
    name: row.name,
    email: row.email,
    phone: row.phone,
    projectType: row.project_type,
    projectGoal: row.project_goal,
    budgetRange: row.budget_range,
    timeline: row.timeline,
    messages: row.messages || [],
    source: row.source,
  };
}

export async function saveLead(pool, input) {
  const lead = normalizeLeadInput(input);

  const result = await pool.query(
    `
      INSERT INTO astro_leads (
        status,
        language,
        name,
        email,
        phone,
        project_type,
        project_goal,
        budget_range,
        timeline,
        messages
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)
      RETURNING *;
    `,
    [
      lead.status,
      lead.language,
      lead.name,
      lead.email,
      lead.phone,
      lead.projectType,
      lead.projectGoal,
      lead.budgetRange,
      lead.timeline,
      JSON.stringify(lead.messages),
    ],
  );

  return mapLeadRow(result.rows[0]);
}

export async function listLeads(pool, limit = 100) {
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 250);
  const result = await pool.query(
    `
      SELECT *
      FROM astro_leads
      ORDER BY created_at DESC
      LIMIT $1;
    `,
    [safeLimit],
  );

  return result.rows.map(mapLeadRow);
}
