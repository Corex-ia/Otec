-- Webpay Plus integration: payments table tracks each Transbank transaction
-- attempt for an order. The `orders`/`order_items`/`enrollments` tables
-- already exist (see 20260320212322_create_otec_schema_fixed.sql).

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  buy_order text NOT NULL,
  session_id text NOT NULL,
  token text UNIQUE,
  amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'initiated', -- initiated | authorized | failed | refunded | reversed
  response_code int,
  authorization_code text,
  payment_type_code text,
  card_last4 text,
  transaction_date timestamptz,
  raw_response jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments(order_id);
CREATE INDEX IF NOT EXISTS payments_token_idx ON payments(token);
CREATE UNIQUE INDEX IF NOT EXISTS payments_buy_order_idx ON payments(buy_order);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id AND orders.user_id = auth.uid()
    )
  );

-- Edge functions use the service role key, which bypasses RLS, for
-- insert/update of payment rows.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS payments_set_updated_at ON payments;
CREATE TRIGGER payments_set_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Allow anonymous (web visitors not yet logged in) users to create a
-- "guest" order to start checkout from the corporate website. They must
-- still authenticate (magic-link/OTP) before the order is committed by
-- webpay-commit, which uses the service role and bypasses RLS anyway.
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
