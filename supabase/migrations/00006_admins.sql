CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admins"
  ON admins FOR SELECT
  USING (auth.uid() = user_id);

-- Seed: first admin (set real user ID after signup)
-- INSERT INTO admins (user_id) VALUES ('<USER_UUID>');
