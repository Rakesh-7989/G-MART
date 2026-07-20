-- Seed product variants for existing products
-- Run this after products exist in the database

-- First, let's see what products exist and add variants for them
-- Using a DO block to handle dynamic product IDs

DO $$
DECLARE
  prod RECORD;
BEGIN
  -- For each product, add 3 color variants
  FOR prod IN SELECT id, name, slug, price FROM products WHERE in_stock = true LIMIT 12
  LOOP
    -- Beige variant (default)
    INSERT INTO product_variants (product_id, name, color_hex, sku, price, stock_quantity, is_default, sort_order)
    VALUES (prod.id, 'Beige', '#F5F0E8', 'VAR-' || upper(substr(prod.slug, 1, 4)) || '-BEIGE', prod.price, 10, true, 1)
    ON CONFLICT (sku) DO NOTHING;

    -- Charcoal variant
    INSERT INTO product_variants (product_id, name, color_hex, sku, price, stock_quantity, is_default, sort_order)
    VALUES (prod.id, 'Charcoal', '#3D3D3D', 'VAR-' || upper(substr(prod.slug, 1, 4)) || '-CHAR', prod.price + 500, 8, false, 2)
    ON CONFLICT (sku) DO NOTHING;

    -- Walnut variant
    INSERT INTO product_variants (product_id, name, color_hex, sku, price, stock_quantity, is_default, sort_order)
    VALUES (prod.id, 'Walnut', '#4A3728', 'VAR-' || upper(substr(prod.slug, 1, 4)) || '-WALN', prod.price + 1000, 6, false, 3)
    ON CONFLICT (sku) DO NOTHING;
  END LOOP;
END $$;