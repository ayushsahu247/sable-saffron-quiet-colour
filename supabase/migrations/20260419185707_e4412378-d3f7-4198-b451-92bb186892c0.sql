ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

CREATE INDEX IF NOT EXISTS orders_stripe_session_id_idx ON public.orders(stripe_session_id);

-- Allow service role to update orders (used by verify-payment edge function)
DROP POLICY IF EXISTS "Service role updates orders" ON public.orders;
CREATE POLICY "Service role updates orders"
  ON public.orders
  FOR UPDATE
  TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow service role to read orders (used by edge functions)
DROP POLICY IF EXISTS "Service role reads orders" ON public.orders;
CREATE POLICY "Service role reads orders"
  ON public.orders
  FOR SELECT
  TO public
  USING (auth.role() = 'service_role');