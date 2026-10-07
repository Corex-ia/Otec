import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key. Used by Next.js
// API routes (e.g. /api/checkout/create-order) to call Supabase Edge
// Functions and read/write rows that bypass RLS. Never expose this client
// or its key to the browser.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
