// The app only reads public, RLS-scoped rows, so it calls Supabase's REST API
// (PostgREST) directly instead of bundling supabase-js and the auth, realtime
// and storage clients it never uses. Same request as
// scripts/snapshot-content.mjs.
//
// The env vars are read per call: static web rendering imports every route at
// build time, where they may be absent (CI builds PRs without secrets).
export async function fetchRows<T>(path: string): Promise<T> {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars are not set");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`GET ${path} failed: ${response.status}`);
  return response.json();
}
