-- Create coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value INTEGER NOT NULL CHECK (value > 0),
  min_order_amount INTEGER DEFAULT 0,
  max_discount INTEGER,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_coupons_code ON coupons(code);

-- Add discount fields to orders
ALTER TABLE orders ADD COLUMN coupon_code TEXT;
ALTER TABLE orders ADD COLUMN discount INTEGER DEFAULT 0;

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access" ON coupons FOR ALL USING (auth.role() = 'authenticated');
