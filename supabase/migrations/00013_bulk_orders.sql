-- Bulk orders / corporate inquiries table
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
  status TEXT DEFAULT 'new', -- new, contacted, quoted, won, lost
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bulk_orders ENABLE ROW LEVEL SECURITY;

-- Public can insert (for inquiry form)
CREATE POLICY "Anyone can create bulk order inquiries" ON bulk_orders
  FOR INSERT WITH CHECK (true);

-- Admin can read all
CREATE POLICY "Admins can read all bulk orders" ON bulk_orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid())
  );

-- Admin can update
CREATE POLICY "Admins can update bulk orders" ON bulk_orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid())
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bulk_orders_status ON bulk_orders(status);
CREATE INDEX IF NOT EXISTS idx_bulk_orders_created ON bulk_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bulk_orders_email ON bulk_orders(email);

-- updated_at trigger
DROP TRIGGER IF EXISTS set_updated_at_bulk_orders ON bulk_orders;
CREATE TRIGGER set_updated_at_bulk_orders
  BEFORE UPDATE ON bulk_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();