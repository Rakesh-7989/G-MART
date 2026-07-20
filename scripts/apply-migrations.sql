-- ============================================
-- G-MART: Create all missing tables
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- ============ Base tables (from 00001-00005) ============

-- Users table (references auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  address JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User addresses
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  label TEXT DEFAULT 'Home',
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own addresses" ON addresses;
CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============ 00006_admins.sql ============
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read admins" ON admins;
CREATE POLICY "Admins can read admins"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============ 00007_inventory_reviews.sql ============
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0;

UPDATE products
SET stock_quantity = 10,
    sku = 'GMRT-' || upper(substr(md5(id::text), 1, 6))
WHERE sku IS NULL OR sku = '';

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
CREATE POLICY "Public read approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can read own reviews" ON reviews;
CREATE POLICY "Users can read own reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============ 00008_coupons.sql ============
CREATE TABLE IF NOT EXISTS coupons (
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

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0;

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can read coupons" ON coupons;
CREATE POLICY "Authenticated users can read coupons"
  ON coupons FOR SELECT
  TO authenticated
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- ============ 00009_returns.sql ============
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'refunded')),
  admin_note TEXT,
  refund_amount INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_return_requests_order ON return_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_status ON return_requests(status);

ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own return requests" ON return_requests;
CREATE POLICY "Users can read own return requests"
  ON return_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create return requests" ON return_requests;
CREATE POLICY "Users can create return requests"
  ON return_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============ 00010_final.sql ============
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock) WHERE in_stock = true;
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_return_requests ON return_requests;
CREATE TRIGGER set_updated_at_return_requests
  BEFORE UPDATE ON return_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION uppercase_coupon_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code = upper(NEW.code);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS uppercase_coupon_code_insert ON coupons;
CREATE TRIGGER uppercase_coupon_code_insert
  BEFORE INSERT ON coupons
  FOR EACH ROW EXECUTE FUNCTION uppercase_coupon_code();

DELETE FROM users u
WHERE NOT EXISTS (SELECT 1 FROM auth.users au WHERE au.id = u.id);

-- ============ 00011_blog.sql ============
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

DROP POLICY IF EXISTS "Public can view published posts" ON posts;
CREATE POLICY "Public can view published posts"
  ON posts FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Admins can manage posts" ON posts;
CREATE POLICY "Admins can manage posts"
  ON posts FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins a WHERE a.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

DROP TRIGGER IF EXISTS set_updated_at_posts ON posts;
CREATE TRIGGER set_updated_at_posts
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============ 00012_product_variants.sql ============
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color_hex TEXT,
  sku TEXT UNIQUE,
  price NUMERIC(10,2),
  compare_at_price NUMERIC(10,2),
  stock_quantity INT DEFAULT 0,
  image TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view variants of published products" ON product_variants;
CREATE POLICY "Public can view variants of published products"
  ON product_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variants.product_id
        AND products.in_stock = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_default
  ON product_variants(product_id, is_default) WHERE is_default = true;

DROP TRIGGER IF EXISTS set_updated_at_product_variants ON product_variants;
CREATE TRIGGER set_updated_at_product_variants
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Make admin: boyapatirakesh7777@gmail.com
-- ============================================
INSERT INTO users (id, name)
SELECT id, 'Rakesh'
FROM auth.users
WHERE email = 'boyapatirakesh7777@gmail.com'
ON CONFLICT (id) DO NOTHING;

INSERT INTO admins (user_id)
SELECT u.id
FROM users u
WHERE u.id = (SELECT id FROM auth.users WHERE email = 'boyapatirakesh7777@gmail.com')
  AND NOT EXISTS (SELECT 1 FROM admins a WHERE a.user_id = u.id);
