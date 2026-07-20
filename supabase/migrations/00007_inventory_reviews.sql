-- Add sku and stock_quantity to products
ALTER TABLE products ADD COLUMN sku TEXT;
ALTER TABLE products ADD COLUMN stock_quantity INTEGER NOT NULL DEFAULT 0;
UPDATE products SET stock_quantity = 10, sku = 'GMRT-' || upper(substr(md5(id::text), 1, 6)) WHERE stock_quantity = 0;

-- Create reviews table
CREATE TABLE reviews (
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

CREATE INDEX idx_reviews_product ON reviews(product_id, is_approved);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can read own reviews" ON reviews FOR SELECT USING (auth.uid() = user_id);
