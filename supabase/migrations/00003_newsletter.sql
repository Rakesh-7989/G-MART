-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert newsletter subscribers"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
