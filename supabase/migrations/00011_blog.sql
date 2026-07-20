-- Blog / CMS
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  image TEXT DEFAULT '',
  author TEXT DEFAULT 'G-MART',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage posts" ON posts
  USING (auth.uid() IN (SELECT id FROM admins));

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_posts ON posts;
CREATE TRIGGER set_updated_at_posts
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
