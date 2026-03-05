-- ===================================================
-- system_settings table: stores CMS-managed config
-- ===================================================
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: only authenticated admins can read/write
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read system_settings"
  ON public.system_settings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can upsert system_settings"
  ON public.system_settings FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update system_settings"
  ON public.system_settings FOR UPDATE
  TO authenticated USING (true);

-- Seed default email config row (disabled by default)
INSERT INTO public.system_settings (key, value)
VALUES (
  'email_config',
  '{
    "enabled": false,
    "resend_api_key": "",
    "admin_email": "",
    "from_name": "LOF Command Center",
    "from_email": "onboarding@resend.dev"
  }'
)
ON CONFLICT (key) DO NOTHING;
