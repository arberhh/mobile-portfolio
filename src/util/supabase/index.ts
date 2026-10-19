import "react-native-url-polyfill/auto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types";

let client: SupabaseClient<Database> | null = null;

// Created lazily: static web rendering imports every route at build time,
// where the env vars may be absent (CI builds PRs without secrets), and
// `createClient` throws on a missing URL. The app is read-only with no auth,
// so there's no session to persist or refresh.
export function getSupabase() {
  if (!client) {
    client = createClient<Database>(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
    );
  }
  return client;
}
