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
    sessionId: cleanText(input.sessionId),
    language: input.language === "fr" || input.language === "ar" ? input.language : "en",
    name: cleanText(input.name),
    companyName: cleanText(input.companyName),
    email: cleanText(input.email),
    phone: cleanText(input.phone),
    projectType: cleanText(input.projectType),
    projectGoal: cleanText(input.projectGoal),
    serviceRequested: cleanText(input.serviceRequested),
    location: cleanText(input.location),
    budgetRange: cleanText(input.budgetRange),
    timeline: cleanText(input.timeline),
    communicationMethod: cleanText(input.communicationMethod),
    additionalNotes: cleanText(input.additionalNotes),
    fileNotes: cleanText(input.fileNotes),
    leadCategory: cleanText(input.leadCategory),
    leadProgress: Math.min(Math.max(Number(input.leadProgress) || 0, 0), 100),
    leadScore: Math.min(Math.max(Number(input.leadScore) || 0, 0), 100),
    urgencyScore: Math.min(Math.max(Number(input.urgencyScore) || 0, 0), 100),
    complexityScore: Math.min(Math.max(Number(input.complexityScore) || 0, 0), 100),
    leadSummary: cleanText(input.leadSummary),
    confirmedAt: input.confirmedAt || null,
    status: ALLOWED_STATUSES.has(status) ? status : "new",
    messages: normalizeMessages(input.messages),
  };

  const hasUsefulData = [
    lead.name,
    lead.companyName,
    lead.email,
    lead.phone,
    lead.projectType,
    lead.projectGoal,
    lead.serviceRequested,
    lead.location,
    lead.budgetRange,
    lead.timeline,
    lead.communicationMethod,
    lead.additionalNotes,
    lead.fileNotes,
  ].some(Boolean) || lead.messages.length > 0;

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
    ALTER TABLE astro_leads
      ADD COLUMN IF NOT EXISTS session_id TEXT,
      ADD COLUMN IF NOT EXISTS company_name TEXT,
      ADD COLUMN IF NOT EXISTS service_requested TEXT,
      ADD COLUMN IF NOT EXISTS location TEXT,
      ADD COLUMN IF NOT EXISTS communication_method TEXT,
      ADD COLUMN IF NOT EXISTS additional_notes TEXT,
      ADD COLUMN IF NOT EXISTS file_notes TEXT,
      ADD COLUMN IF NOT EXISTS lead_category TEXT,
      ADD COLUMN IF NOT EXISTS lead_progress INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS lead_score INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS urgency_score INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS complexity_score INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS lead_summary TEXT,
      ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS astro_leads_session_id_idx
    ON astro_leads (session_id)
    WHERE session_id IS NOT NULL;
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS astro_leads_created_at_idx
    ON astro_leads (created_at DESC);
  `);
}

function mapLeadRow(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    language: row.language,
    name: row.name,
    companyName: row.company_name,
    email: row.email,
    phone: row.phone,
    projectType: row.project_type,
    projectGoal: row.project_goal,
    serviceRequested: row.service_requested,
    location: row.location,
    budgetRange: row.budget_range,
    timeline: row.timeline,
    communicationMethod: row.communication_method,
    additionalNotes: row.additional_notes,
    fileNotes: row.file_notes,
    leadCategory: row.lead_category,
    leadProgress: row.lead_progress,
    leadScore: row.lead_score,
    urgencyScore: row.urgency_score,
    complexityScore: row.complexity_score,
    leadSummary: row.lead_summary,
    confirmedAt: row.confirmed_at,
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
        session_id,
        language,
        name,
        company_name,
        email,
        phone,
        project_type,
        project_goal,
        service_requested,
        location,
        budget_range,
        timeline,
        communication_method,
        additional_notes,
        file_notes,
        lead_category,
        lead_progress,
        lead_score,
        urgency_score,
        complexity_score,
        lead_summary,
        confirmed_at,
        messages
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24::jsonb)
      RETURNING *;
    `,
    [
      lead.status,
      lead.sessionId,
      lead.language,
      lead.name,
      lead.companyName,
      lead.email,
      lead.phone,
      lead.projectType,
      lead.projectGoal,
      lead.serviceRequested,
      lead.location,
      lead.budgetRange,
      lead.timeline,
      lead.communicationMethod,
      lead.additionalNotes,
      lead.fileNotes,
      lead.leadCategory,
      lead.leadProgress,
      lead.leadScore,
      lead.urgencyScore,
      lead.complexityScore,
      lead.leadSummary,
      lead.confirmedAt,
      JSON.stringify(lead.messages),
    ],
  );

  return mapLeadRow(result.rows[0]);
}

export async function upsertLeadDraft(pool, input) {
  const lead = normalizeLeadInput(input);

  if (!lead.sessionId) {
    throw new Error("Lead draft needs a sessionId.");
  }

  const result = await pool.query(
    `
      INSERT INTO astro_leads (
        session_id,
        status,
        language,
        name,
        company_name,
        email,
        phone,
        project_type,
        project_goal,
        service_requested,
        location,
        budget_range,
        timeline,
        communication_method,
        additional_notes,
        file_notes,
        lead_category,
        lead_progress,
        lead_score,
        urgency_score,
        complexity_score,
        lead_summary,
        confirmed_at,
        messages
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24::jsonb)
      ON CONFLICT (session_id)
      WHERE session_id IS NOT NULL
      DO UPDATE SET
        updated_at = now(),
        status = EXCLUDED.status,
        language = EXCLUDED.language,
        name = COALESCE(EXCLUDED.name, astro_leads.name),
        company_name = COALESCE(EXCLUDED.company_name, astro_leads.company_name),
        email = COALESCE(EXCLUDED.email, astro_leads.email),
        phone = COALESCE(EXCLUDED.phone, astro_leads.phone),
        project_type = COALESCE(EXCLUDED.project_type, astro_leads.project_type),
        project_goal = COALESCE(EXCLUDED.project_goal, astro_leads.project_goal),
        service_requested = COALESCE(EXCLUDED.service_requested, astro_leads.service_requested),
        location = COALESCE(EXCLUDED.location, astro_leads.location),
        budget_range = COALESCE(EXCLUDED.budget_range, astro_leads.budget_range),
        timeline = COALESCE(EXCLUDED.timeline, astro_leads.timeline),
        communication_method = COALESCE(EXCLUDED.communication_method, astro_leads.communication_method),
        additional_notes = COALESCE(EXCLUDED.additional_notes, astro_leads.additional_notes),
        file_notes = COALESCE(EXCLUDED.file_notes, astro_leads.file_notes),
        lead_category = COALESCE(EXCLUDED.lead_category, astro_leads.lead_category),
        lead_progress = GREATEST(EXCLUDED.lead_progress, astro_leads.lead_progress),
        lead_score = GREATEST(EXCLUDED.lead_score, astro_leads.lead_score),
        urgency_score = GREATEST(EXCLUDED.urgency_score, astro_leads.urgency_score),
        complexity_score = GREATEST(EXCLUDED.complexity_score, astro_leads.complexity_score),
        lead_summary = COALESCE(EXCLUDED.lead_summary, astro_leads.lead_summary),
        confirmed_at = COALESCE(EXCLUDED.confirmed_at, astro_leads.confirmed_at),
        messages = EXCLUDED.messages
      RETURNING *;
    `,
    [
      lead.sessionId,
      lead.status,
      lead.language,
      lead.name,
      lead.companyName,
      lead.email,
      lead.phone,
      lead.projectType,
      lead.projectGoal,
      lead.serviceRequested,
      lead.location,
      lead.budgetRange,
      lead.timeline,
      lead.communicationMethod,
      lead.additionalNotes,
      lead.fileNotes,
      lead.leadCategory,
      lead.leadProgress,
      lead.leadScore,
      lead.urgencyScore,
      lead.complexityScore,
      lead.leadSummary,
      lead.confirmedAt,
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
