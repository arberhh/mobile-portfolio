---
name: run-expo
description: Launch and drive this Expo/React Native portfolio app for local development and testing.
---

# Running this app

This is an Expo (SDK 57) React Native app. `expo start` boots the
Metro bundler; pick a platform from there.

## Setup

Env vars are needed to see live data, but not to run: screens render from
the committed content snapshot (`src/content/snapshot.json`) and the live
refresh just fails quietly without them (the Supabase client is created
lazily, so nothing throws at import):

```bash
cp .env.example .env
# fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
```

## Launch

```bash
npx expo start --ios      # opens iOS Simulator (Xcode installed, confirmed working)
npx expo start --android
npx expo start --web --port 8090   # react-dom/react-native-web are already installed, no extra setup
```

Default Metro port is 8081; the examples here use 8090 for `--web` to
avoid clashing with a native Metro instance running at the same time.
To stop either: `lsof -ti:<port> -sTCP:LISTEN | xargs -r kill`.

**Backgrounding `expo start`:** it's a long-running process, not a
one-shot command. Launch it as its own backgrounded tool call (pass
`run_in_background: true` on the bare `npx expo start ...` command
itself) rather than wrapping it in `nohup ... &` inside a shell script —
a wrapped background job gets torn down when the wrapping script's own
call finishes, so the server dies with it. If a port is already in use,
that's usually a previous run of this same server still alive in the
background, not a failure — check `curl -s -o /dev/null -w '%{http_code}'
http://localhost:<port>` before relaunching.

## Verify it's running

Don't just launch it — confirm data actually loaded. Screens render from the
committed snapshot first, so cards and the profile look fine even when the
live fetch fails: a normal-looking screen only proves the snapshot, not
Supabase.

**Native (iOS Simulator):**

1. Wait for Metro to finish bundling (watch the log for `Bundling
   complete`, not a fixed sleep).
2. Screenshot the simulator: `xcrun simctl io booted screenshot
   /tmp/verify.png`, then look at it. Confirm the profile name /
   project cards render instead of the red error banner.
3. Faster signal without a screenshot: tail the Metro log for the
   error strings from `supabase-service/index.ts` —
   `"There was an issue with fetching the projects…"` / `"…the
   developer profile…"`. If those appear, the live refresh failed
   (env vars missing/wrong, or RLS blocking the read — see gotcha
   below), and the screen is still showing the snapshot. If the bundle
   finished and neither string appears, that's a decent proxy the
   fetch succeeded. To be sure, check for content newer than the
   snapshot.

**Web:** once `curl` against the dev server port returns `200`, drive it
with Playwright (`npx playwright install chromium` once per machine) —
`chromium.launch()`, `newPage({ viewport: { width, height } })`,
`page.goto('http://localhost:<port>', { waitUntil: 'networkidle' })`,
then `page.screenshot()` and actually look at the result. Use a narrow
viewport (~420px) to check the native-equivalent layout and a wide one
(≥900px, where `WEB_SHELL_CSS` shows the `WebAppShell` sidebar) to check
the sidebar layout — they render meaningfully differently. The routes are
`/`, `/profile`, and `/project/<slug>`; browse them by URL.

To check the static export (what GitHub Pages serves), run
`EXPO_NO_DOTENV=1 npx expo export --platform web`, then
`node scripts/postexport-web.mjs`, and serve `dist/` under the
`/mobile-portfolio/` base path. Load each page in a browser and read the
console: a hydration error ("server rendered HTML didn't match") means
something rendered differently on the server, usually window size or an
icon-font glyph outside `src/components/icon`. `npx playwright` installs into an
npx cache directory rather than this project's `node_modules`; if a
plain `node script.js` can't `require('playwright')`, point `NODE_PATH`
at that cache dir (find it via `find ~/.npm/_npx -maxdepth 3 -iname
playwright -type d`).

## Gotchas

- **RLS fails silently.** The `profile`/`projects`/`domains` tables
  (and `project_domains`) have Row Level Security enabled. A missing `SELECT` policy for
  `anon` doesn't error — PostgREST just returns 0 rows, which shows
  up in the app as "Cannot coerce the result to a single JSON object"
  (profile) or an empty list (projects). Table-level `GRANT`s alone
  are not enough; check `pg_policies` on the Supabase project.
