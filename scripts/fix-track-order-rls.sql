-- ============================================
-- Add RLS policy for guest order tracking
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- Allow anonymous users to read orders by customer_email (for guest order tracking)
DROP POLICY IF EXISTS "Guest order tracking by email" ON orders;
CREATE POLICY "Guest order tracking by email"
  ON orders FOR SELECT
  TO anon
  USING (user_id IS NULL AND customer_email IS NOT NULL);

-- Also add policy for authenticated users to read their own orders (already exists, but let's ensure it's correct)
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Also allow authenticated users to read their own orders even if user_id is null? No, that would be a security issue.
-- The authenticated policy only allows reading where user_id = auth.uid()
-- The anon policy allows reading guest orders (user_id IS NULL) by customer_email