-- Add tracking fields to orders
ALTER TABLE orders ADD COLUMN tracking_number TEXT;
ALTER TABLE orders ADD COLUMN tracking_url TEXT;
ALTER TABLE orders ADD COLUMN shipped_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN delivered_at TIMESTAMPTZ;

-- Create return_requests table
CREATE TABLE return_requests (
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

CREATE INDEX idx_return_requests_order ON return_requests(order_id);
CREATE INDEX idx_return_requests_status ON return_requests(status);

ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own return requests" ON return_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create return requests" ON return_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
