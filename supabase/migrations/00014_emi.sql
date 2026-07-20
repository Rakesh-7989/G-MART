-- Add EMI support to orders table
-- Store EMI plan details from payment gateway

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_data JSONB;

-- Update check constraint to allow 'emi' as payment_method
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('cod', 'cashfree', 'emi'));
