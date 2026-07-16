-- ========================================
-- G-MART: Complete Migration + Seed Data
-- Paste this in Supabase Dashboard → SQL Editor
-- ========================================

-- 1. Create tables
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  compare_at_price INTEGER,
  images JSONB NOT NULL DEFAULT '[]',
  category_id UUID REFERENCES categories(id),
  material TEXT,
  dimensions TEXT,
  color TEXT,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'cod',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  total INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID,
  product_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1
);

-- 2. Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Public read access" ON categories;
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON products;
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read orders" ON orders;
CREATE POLICY "Anyone can read orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read order items" ON order_items;
CREATE POLICY "Anyone can read order items" ON order_items FOR SELECT USING (true);

-- 4. Seed Categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Living Room', 'living-room', 'Sofas, chairs, and coffee tables'),
  ('a0000000-0000-0000-0000-000000000002', 'Dining', 'dining', 'Dining tables, chairs, and serveware'),
  ('a0000000-0000-0000-0000-000000000003', 'Bedroom', 'bedroom', 'Beds, nightstands, and dressers'),
  ('a0000000-0000-0000-0000-000000000004', 'Office', 'office', 'Desks, chairs, and bookshelves'),
  ('a0000000-0000-0000-0000-000000000005', 'Storage', 'storage', 'Cabinets, shelves, and consoles'),
  ('a0000000-0000-0000-0000-000000000006', 'Decor', 'decor', 'Rugs, vases, and wall art'),
  ('a0000000-0000-0000-0000-000000000007', 'Lighting', 'lighting', 'Chandeliers, lamps, and sconces')
ON CONFLICT (slug) DO NOTHING;

-- 5. Seed Products
INSERT INTO products (id, name, slug, description, price, compare_at_price, images, category_id, material, dimensions, color, in_stock, featured, rating, review_count) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'Majestic Oak Dining Table',
  'majestic-oak-dining-table',
  'Handcrafted from solid sheesham wood with a rich walnut finish. Seats 8-10 people comfortably.',
  84999, 99999,
  '["https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"]',
  'a0000000-0000-0000-0000-000000000002',
  'Sheesham Wood', '213 x 91 x 76 cm', 'Walnut', true, true, 4.8, 124
),
(
  'b0000000-0000-0000-0000-000000000002',
  'Velvet Empire Sofa',
  'velvet-empire-sofa',
  'Premium velvet upholstery with deep button tufting and solid mango wood frame.',
  124999, 149999,
  '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800","https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800"]',
  'a0000000-0000-0000-0000-000000000001',
  'Velvet + Mango Wood', '210 x 85 x 75 cm', 'Emerald Green', true, true, 4.9, 89
),
(
  'b0000000-0000-0000-0000-000000000003',
  'Artisan Bookshelf Collection',
  'artisan-bookshelf-collection',
  'Modular bookshelf system crafted from reclaimed teak wood. Adjustable shelves.',
  67999, NULL,
  '["https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800","https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=800"]',
  'a0000000-0000-0000-0000-000000000005',
  'Reclaimed Teak', '180 x 35 x 200 cm', 'Natural Teak', true, true, 4.7, 56
),
(
  'b0000000-0000-0000-0000-000000000004',
  'Royal Canopy Bed',
  'royal-canopy-bed',
  'Majestic king-size bed frame carved from solid acacia wood. Regal canopy design.',
  189999, 219999,
  '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800","https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800"]',
  'a0000000-0000-0000-0000-000000000003',
  'Acacia Wood', '213 x 183 x 210 cm', 'Dark Walnut', true, true, 4.9, 43
),
(
  'b0000000-0000-0000-0000-000000000005',
  'Marble Coffee Table',
  'marble-coffee-table',
  'Italian marble top on a brushed brass frame. Elegant, timeless design.',
  45999, NULL,
  '["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800","https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800"]',
  'a0000000-0000-0000-0000-000000000001',
  'Italian Marble + Brass', '120 x 60 x 45 cm', 'White Marble / Gold', true, false, 4.6, 78
),
(
  'b0000000-0000-0000-0000-000000000006',
  'Leather Executive Desk',
  'leather-executive-desk',
  'Premium top-grain leather inlay desk with solid mahogany frame. Brass hardware.',
  139999, NULL,
  '["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800","https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800"]',
  'a0000000-0000-0000-0000-000000000004',
  'Mahogany + Leather', '183 x 91 x 76 cm', 'Mahogany / Cognac', true, true, 4.8, 34
),
(
  'b0000000-0000-0000-0000-000000000007',
  'Hand-Knotted Silk Rug',
  'hand-knotted-silk-rug',
  'Pure silk hand-knotted in Varanasi. Traditional pattern with modern color palette.',
  79999, 99999,
  '["https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=800","https://images.unsplash.com/photo-1600166898405-da9535204843?w=800"]',
  'a0000000-0000-0000-0000-000000000006',
  'Pure Silk', '244 x 183 cm', 'Ivory / Gold', true, false, 4.9, 27
),
(
  'b0000000-0000-0000-0000-000000000008',
  'Crystal Chandelier',
  'crystal-chandelier',
  'Bohemian crystal chandelier with hand-polished K9 crystal drops. Gold-finished frame.',
  54999, NULL,
  '["https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800","https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800"]',
  'a0000000-0000-0000-0000-000000000007',
  'K9 Crystal + Brass', '80 x 80 x 100 cm', 'Crystal / Gold', true, false, 4.7, 52
),
(
  'b0000000-0000-0000-0000-000000000009',
  'Upholstered Wing Chair',
  'upholstered-wing-chair',
  'Classic wingback chair reimagined in rich velvet. Nailhead trim, flared arms.',
  45999, NULL,
  '["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800","https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800"]',
  'a0000000-0000-0000-0000-000000000001',
  'Velvet + Hardwood', '94 x 85 x 102 cm', 'Navy Blue', true, false, 4.5, 63
),
(
  'b0000000-0000-0000-0000-000000000010',
  'Console Entry Table',
  'console-entry-table',
  'Slim console table in carved mango wood with marble inlay top. Perfect for hallways.',
  32999, NULL,
  '["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800","https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800"]',
  'a0000000-0000-0000-0000-000000000005',
  'Mango Wood + Marble', '120 x 35 x 76 cm', 'Honey / White', true, false, 4.6, 41
)
ON CONFLICT (slug) DO NOTHING;
