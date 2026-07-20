-- Product variants (color, price, stock per variant)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,              -- e.g. "Beige", "Charcoal", "Walnut"
  color_hex TEXT,                  -- e.g. "#F5F0E8", "#3D3D3D", "#4A3728"
  sku TEXT UNIQUE,                 -- variant-specific SKU
  price NUMERIC(10,2),             -- override product price (optional)
  compare_at_price NUMERIC(10,2),  -- override compare-at price (optional)
  stock_quantity INT DEFAULT 0,
  image TEXT,                      -- variant-specific image
  is_default BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view variants of published products" ON product_variants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_variants.product_id AND in_stock = true)
  );

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_default ON product_variants(product_id, is_default) WHERE is_default = true;

-- updated_at trigger
DROP TRIGGER IF EXISTS set_updated_at_product_variants ON product_variants;
CREATE TRIGGER set_updated_at_product_variants
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed some sample variants for existing products (optional - uncomment to use)
-- INSERT INTO product_variants (product_id, name, color_hex, sku, price, stock_quantity, is_default, sort_order)
-- SELECT id, 'Beige', '#F5F0E8', 'VAR-BEIGE-001', price, 10, true, 1 FROM products LIMIT 1;