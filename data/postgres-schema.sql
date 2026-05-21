CREATE TABLE IF NOT EXISTS astro_leads (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  language TEXT NOT NULL DEFAULT 'en',
  name TEXT,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  project_type TEXT,
  project_goal TEXT,
  service_requested TEXT,
  location TEXT,
  budget_range TEXT,
  timeline TEXT,
  communication_method TEXT,
  additional_notes TEXT,
  file_notes TEXT,
  lead_category TEXT,
  lead_progress INTEGER NOT NULL DEFAULT 0,
  confirmed_at TIMESTAMPTZ,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  source TEXT NOT NULL DEFAULT 'website-widget'
);

CREATE INDEX IF NOT EXISTS astro_leads_created_at_idx
ON astro_leads (created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS astro_leads_session_id_idx
ON astro_leads (session_id)
WHERE session_id IS NOT NULL;
