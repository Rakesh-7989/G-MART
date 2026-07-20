-- Performance indexes
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

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_return_requests') THEN
    CREATE TRIGGER set_updated_at_return_requests
      BEFORE UPDATE ON return_requests
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- Coupon code should be uppercase on insert
CREATE OR REPLACE FUNCTION uppercase_coupon_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code = upper(NEW.code);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'uppercase_coupon_code_insert') THEN
    CREATE TRIGGER uppercase_coupon_code_insert
      BEFORE INSERT ON coupons
      FOR EACH ROW EXECUTE FUNCTION uppercase_coupon_code();
  END IF;
END $$;

-- Clean up orphaned users (no auth user)
DELETE FROM users WHERE id NOT IN (SELECT id FROM auth.users);
