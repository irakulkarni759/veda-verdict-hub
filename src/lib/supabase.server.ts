import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Service-role client. This bypasses Row Level Security, so it must only
// ever be used inside .server.ts files / createServerFn handlers — never
// imported into a component or any file bundled for the browser.
//
// Reads env lazily inside the getter (not at module scope) so the value is
// never inlined into the client bundle and works correctly under Worker SSR.
// See: TanStack Start execution-model docs.

let cachedClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. Add them as server secrets in your deployment settings — NOT as VITE_-prefixed vars, which get bundled into client code.",
    );
  }

  cachedClient = createClient(url, serviceKey, { auth: { persistSession: false } });
  return cachedClient;
}
