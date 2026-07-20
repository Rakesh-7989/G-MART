-- ============================================
-- Fix table name mismatches
-- My migration created wrong table names
-- ============================================

-- Fix 1: newsletter -> newsletter_subscribers
DROP TABLE IF EXISTS newsletter;
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert newsletter subscribers" ON newsletter_subscribers;
CREATE POLICY "Anyone can insert newsletter subscribers"
  ON newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Only admins can view subscribers" ON newsletter_subscribers;
CREATE POLICY "Only admins can view subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Fix 2: contact -> contact_messages
DROP TABLE IF EXISTS contact;
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Only admins can view messages" ON contact_messages;
CREATE POLICY "Only admins can view messages"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Fix 3: bulk_orders table
CREATE TABLE IF NOT EXISTS bulk_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  industry TEXT,
  project_type TEXT,
  quantity TEXT,
  timeline TEXT,
  budget TEXT,
  message TEXT,
  products TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE bulk_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can create bulk order inquiries" ON bulk_orders;
CREATE POLICY "Anyone can create bulk order inquiries" ON bulk_orders
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can read all bulk orders" ON bulk_orders;
CREATE POLICY "Admins can read all bulk orders" ON bulk_orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins a WHERE a.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "Admins can update bulk orders" ON bulk_orders;
CREATE POLICY "Admins can update bulk orders" ON bulk_orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins a WHERE a.user_id = auth.uid())
  );
CREATE INDEX IF NOT EXISTS idx_bulk_orders_status ON bulk_orders(status);
CREATE INDEX IF NOT EXISTS idx_bulk_orders_created ON bulk_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bulk_orders_email ON bulk_orders(email);
DROP TRIGGER IF EXISTS set_updated_at_bulk_orders ON bulk_orders;
CREATE TRIGGER set_updated_at_bulk_orders
  BEFORE UPDATE ON bulk_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
