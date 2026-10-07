import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Browser-side Supabase client (anon key only). Used to call public Edge
// Functions and read RLS-protected data.
export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function createClient() {
  return supabase;
}
