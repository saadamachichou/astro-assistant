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

CREATE INDEX IF NOT EXISTS astro_leads_created_at_idx
ON astro_leads (created_at DESC);
