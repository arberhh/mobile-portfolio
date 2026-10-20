# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, Cursor, and others) when working with code in this repository.

## Commands

```bash
npm run ts:check                # TypeScript, no emit
npm run lint                    # oxlint --deny-warnings . && eslint . --max-warnings=0
npm run format                  # oxfmt . (write)
npm run format:check            # oxfmt --check .
npm run test                    # jest (jest-expo preset)
npm run deadcode                # knip — unused exports/deps, entry points app/**/*.tsx + scripts/*.mjs
npm run snapshot                # refresh src/content/snapshot.json from Supabase (needs .env); not a CI check
npx expo export --platform web  # web build sanity check
```

Single test file: `npx jest src/hooks/index.test.ts` (or any path). No `test:watch` script is defined; use `npx jest --watch` if needed.

These, except `format`/`format:check`, are exactly the checks CI (`.github/workflows/ci.yml`) runs on every PR/push to `main`. **Do not run any of these commands (or `expo start`/`npm run ios`/`npm run android`/`npm run web`) after finishing a task — CI runs them.** Only run a check yourself if you need its output to keep working (e.g. `ts:check` after a risky refactor); otherwise leave verification to CI.

Formatting isn't a CI check — a pre-commit hook (`.githooks/pre-commit`, installed via `npm run prepare`) runs `oxfmt` on staged files and re-stages them automatically, so it's already correct by the time a commit exists.

## Architecture

Expo (SDK 57) + React Native 0.86 + React 19, TypeScript, targeting iOS/Android/web from one codebase via `react-native-web`. Path alias `@/*` → `src/*`.

**Data flow**: `src/util/supabase/index.ts` lazily creates one Supabase client via `getSupabase()` (env: `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY`; lazy so a missing env never throws at import, no session persistence). `src/services/supabase-service` is the _only_ place that talks to Supabase — `getProjects` and `getProfile`, each running through a shared `runQuery` helper (normalizes `{ data, error }` into a thrown `Error`), flattening the `project_domains` join via `withFlattenedDomains`, coercing nullable columns via `toProject`, and prefetching images with `Image.prefetch`. Screens consume these through `useAsync` (`src/hooks/index.ts`), a `{ data, loading, error }` hook — the app's only data-fetching pattern, no query-caching library. The initial value is the committed build-time snapshot (`src/content/snapshot.json`, refreshed by `npm run snapshot` / `scripts/snapshot-content.mjs`), so screens render content immediately and the fetch only refreshes it. `npm run deploy` refreshes its own copy but doesn't commit it, so the committed copy only changes when someone runs `npm run snapshot` and commits.

**Content**: projects/profile are edited only through SQL migrations in `supabase/migrations/` (applied automatically by the Supabase GitHub integration when a PR merges to `main`; there's no manual `supabase db push`, so upload any images a migration references _before_ merging). Card banners must be 1200×450 PNGs (8:3, the fixed card frame); project `slug`s are the URL (`/project/<slug>`); `role`/`period`/`highlight`/store links/`banner_alt` are optional and hidden when null. Storage uploads are allowed via `supabase storage cp --experimental --linked`. The step-by-step is in `docs/SETUP.md`. Generated Supabase types live in `src/types/supabase.ts`; hand-written domain types in `src/types/index.ts` derive from them with `Pick`/mapped types rather than being redefined.

**Backend**: Supabase (Postgres + PostgREST), read-only from the client. Tables `projects`, `domains`, `project_domains`, `profile` — RLS enabled everywhere with `select`-only policies for `anon`/`authenticated`, no auth flow or write path in the client. Migrations live in `supabase/migrations/`, applied by the Supabase GitHub integration when a PR merges to `main` (CLI config in `supabase/config.toml`).

**Navigation**: Expo Router (`main: expo-router/entry`). `app/` holds only thin route files that re-export screens from `src/screens`: `index.tsx` (Home, `src/screens/projects`), `profile.tsx` (`src/screens/user`), `project/[slug].tsx` (`src/screens/project-detail`, with `generateStaticParams` from the content snapshot), `+not-found.tsx`. `app/_layout.tsx` loads fonts, mounts the providers and `WebAppShell`, and renders a headerless `Stack`. Screens navigate with `useRouter`/`<Link>`; "back" falls back to `router.replace("/")` when a deep link opened the screen with no history. Each screen sets its `<title>`/meta/canonical via `<PageHead>` (`expo-router/head`).

**Static web**: `web.output: "static"` pre-renders every route to HTML (`npx expo export --platform web`), seeded from the content snapshot, so anything a screen renders must be identical on the server and on the client's first render. Window size and icon-font state aren't (`useWindowDimensions`, `@expo/vector-icons`), hence the CSS-driven `WebAppShell` and the `Icon` wrapper (`src/components/icon`, renders after hydration via `useHydrated`). Always render icons through `Icon` — it's also what keeps Ionicons the only icon font in the bundle. `app/+html.tsx` is the HTML template (GA tag, site-wide meta, shell CSS). `scripts/postexport-web.mjs` (run by `npm run deploy`) adds `404.html` and `sitemap.xml` for GitHub Pages.

**Web-specific behavior**: platform-extension resolution (`.web.tsx`) is used instead of scattering `Platform.OS === "web"` checks through shared components — see `src/components/web-app-shell/` (`index.tsx` native no-op vs `index.web.tsx` persistent sidebar, shown above 900px by a media query in `WEB_SHELL_CSS`, `src/constants/web.ts`). Prefer this `.web.tsx` split over inline `Platform.OS` checks for anything beyond a tiny diff.

**Theming**: `src/context/index.tsx` — `ThemeProvider` via `useReducer`, single `TOGGLE_THEME` action, defaults to dark. `useSystemThemeSync` (`src/hooks/use-system-theme-sync`) listens to `Appearance.addChangeListener` and syncs theme to OS setting; invoked once, from `Home`. Theme tokens (`lightTheme`/`darkTheme`) live in `src/themes/index.ts`, consumed via `useTheme()`.

## CI/CD

- `ci.yml` — `npm ci`, `npm audit --audit-level=high`, `ts:check`, `lint`, `test`, web export build check, `deadcode` (knip). Formatting is enforced by the pre-commit hook, not CI.
- `eas-update-on-release.yml` — on push to `main`, publishes an OTA update to production via `.eas/workflows/publish-update.yml`. `runtimeVersion` = `appVersion`, so bump `version` in `app.json` whenever native dependencies change, or the update reaches binaries that lack the native code.
- `claude.yml` / `claude-code-review.yml` — Claude Code GitHub Actions for PR review/assistance.
- Builds/submits (not OTA) are configured in `eas.json` (`development`/`preview`/`production` profiles), run manually via `eas build`/`eas submit`.

## Commit/PR conventions

Do not add `Co-Authored-By`/`Generated with Claude Code` attribution to commits or PRs in this repo.
