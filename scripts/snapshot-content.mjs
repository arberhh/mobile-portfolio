// Pulls the current projects + profile from Supabase into
// src/content/snapshot.json. The app renders from that snapshot first (it's
// what static web export bakes into each page's HTML, and what native shows
// instantly) and then refreshes from Supabase at runtime.
//
// Without Supabase env vars (e.g. CI on pull requests) it keeps the
// committed snapshot and exits cleanly.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "src/content/snapshot.json");

function loadDotEnv() {
  const envFile = join(root, ".env");
  if (!existsSync(envFile)) return;
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

loadDotEnv();

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn("snapshot-content: Supabase env not set, keeping the committed snapshot.");
  process.exit(0);
}

async function get(path) {
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) {
    throw new Error(`GET ${path} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

// Same select as src/services/supabase-service (DOMAINS_SELECT).
const projects = await get(
  "projects?select=*,project_domains(domains(id,title,icon))&order=created_at.desc",
);
const [profile] = await get("profile?select=*&limit=1");

writeFileSync(outFile, `${JSON.stringify({ projects, profile: profile ?? null }, null, 2)}\n`);
console.log(`snapshot-content: wrote ${projects.length} projects to src/content/snapshot.json`);
