# Architecture

A technical overview of how this app is put together — for local setup and running it, see [SETUP.md](SETUP.md).

## Stack

- **Expo (SDK 57) + React Native 0.86 + React 19**, written in TypeScript.
- **react-native-web** — the same codebase targets iOS, Android, and web (`npm run web`, or `npx expo export --platform web` for a static build).
- **Expo Router** for file-based routing, with static rendering on web (`web.output: "static"`): every route, including each project, is pre-rendered to its own HTML page.
- **Supabase** (`@supabase/supabase-js`) as the backend — Postgres + PostgREST, read-only from the client.
- **react-native-reanimated** / **react-native-gesture-handler** for animation and gestures (the project carousel, slideshow).
- **oxlint + eslint**, **oxfmt**, **tsc**, **knip**, and **jest** for linting, formatting, type checking, dead-code detection, and tests — all wired into CI (`.github/workflows/ci.yml`).

## Project structure

```
app/                     # Expo Router routes (thin files re-exporting screens)
  _layout.tsx             # fonts, providers, WebAppShell, Stack
  +html.tsx               # web HTML template (static rendering)
  index.tsx               # / (Home)
  profile.tsx             # /profile
  project/[slug].tsx      # /project/<slug>, pre-rendered per snapshot project
  +not-found.tsx          # 404
scripts/                 # snapshot-content.mjs, postexport-web.mjs
src/
  screens/                # one folder per screen (projects=Home, project-detail, user, not-found)
  components/             # shared presentational components
  context/                # ThemeProvider (light/dark theme state)
  hooks/                  # useAsync, useHydrated, useSystemThemeSync
  services/                # data-fetching layer (wraps the Supabase client)
  content/                # build-time content snapshot (snapshot.json) + accessors
  util/supabase/          # Supabase client instantiation
  types/                  # shared types + generated Supabase Database type
  themes/                 # light/dark color tokens
  constants/               # fonts, colors, web breakpoints
  common/                 # shared StyleSheet fragments (flex, spacing, text)
supabase/
  migrations/             # SQL migrations (schema + RLS policies)
  config.toml             # Supabase CLI project config
docs/
  SETUP.md                # local dev setup
  ARCHITECTURE.md          # this file
```

Path alias `@/*` (see `tsconfig.json`) maps to `src/*`, so imports read as `@/components`, `@/services`, etc.

## Data flow

1. `src/util/supabase/index.ts` lazily creates a single Supabase client (`getSupabase()`) from the `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` env vars, with the `react-native-url-polyfill` for `fetch`/URL support on native. It's lazy so importing it never throws when the env vars are absent (e.g. CI building without secrets), and it doesn't persist a session — the app is read-only with no auth.
2. `src/services/supabase-service` is the only place that talks to Supabase. It exposes `getProjects` and `getProfile`, each of which:
   - runs a PostgREST query through a shared `runQuery` helper that normalizes Supabase's `{ data, error }` response into a thrown `Error` with a user-facing fallback message,
   - flattens the `project_domains` join table into a plain `domains` array (`withFlattenedDomains`),
   - coerces nullable Postgres columns to safe defaults (`toProject`), deriving a `slug` from the title when none is stored,
   - prefetches image URLs via `expo-image`'s `Image.prefetch` so banners/gallery images are warm before they're rendered.
3. `scripts/snapshot-content.mjs` (`npm run snapshot`) copies the current projects + profile into `src/content/snapshot.json`, which is committed. `npm run deploy` refreshes its own copy before building, but doesn't commit it back, so the committed copy (what CI builds and the native app's first render use) only updates when someone runs `npm run snapshot` and commits. `src/content` parses it with the same `parseProjects` the service uses.
4. Screens call the service functions through `useAsync`, a small hook (`src/hooks/index.ts`) that tracks `{ data, loading, error }` for a fetcher function — this is the app's only data-fetching pattern, there is no separate query-caching library. Screens pass the snapshot as the initial value (`hasInitialData`), so content renders immediately, the fetch only refreshes it, and a failed refresh keeps the snapshot rather than showing an error.
5. Types for the Supabase schema (`src/types/supabase.ts`) are generated from the database; hand-written domain types (`Project`, `Profile`, `Domain`, …) in `src/types/index.ts` derive from them with `Pick`/mapped types rather than being redefined by hand.

## Screens & navigation

Routes live in `app/` (Expo Router) and re-export screens from `src/screens`:

- **`/`** (`src/screens/projects`) — opens with an `Intro` (name, headline, bio, and `ContactLinks` from the profile), then lists all projects (`getProjects`) as `Project` cards: banner, role · period, a one-line highlight, and tags. Each card is a `<Link>` (a real `<a href>` on web) to its project page.
- **`/project/[slug]`** (`src/screens/project-detail`) — finds its project by slug in the (snapshot-seeded) `getProjects` list, renders its slideshow, role/period/highlight, store and source links (each only when set), description, and tech/contribution lists. `generateStaticParams` pre-renders one page per snapshot project.
- **`/profile`** (`src/screens/user`) — the profile (`getProfile`): headline, bio, tech stack, and contact links (Email, LinkedIn, GitHub, and CV when `cv_url` is set).
- **`+not-found`** — exported as `404.html` for GitHub Pages.

Each screen sets its own `<title>`, description, canonical and Open Graph tags through `<PageHead>` (`expo-router/head`), so shared links preview the right page. Back buttons call `router.back()`, or `router.replace("/")` when a deep link opened the screen with no history.

## Web-specific behavior

React Native's platform-extension resolution (`.web.tsx`) is used instead of scattering `Platform.OS === "web"` checks through shared components — see `src/components/web-app-shell/`:

- `index.tsx` (native default) is a no-op passthrough.
- `index.web.tsx` wraps the whole router stack (from `app/_layout.tsx`) with a persistent sidebar (Projects/Profile) and a fixed-width reading column. The markup is identical at every width; a media query (`WEB_SHELL_CSS` in `src/constants/web.ts`, injected by `app/+html.tsx`) shows the sidebar above 900px. It's CSS rather than `useWindowDimensions` because static HTML is rendered without a window, and a JS-measured layout would never hydrate cleanly.

The same constraint is why icons go through `src/components/icon`: glyph rendering depends on the icon font having loaded, which differs between server and client, so on web the glyph renders right after hydration (`useHydrated`) in a same-size box.

## Theming

`src/context/index.tsx` implements a `ThemeProvider` backed by `useReducer` with a single `TOGGLE_THEME` action, defaulting to dark (`darkState`). `useSystemThemeSync` (`src/hooks/use-system-theme-sync`) listens to `Appearance.addChangeListener` and toggles the theme when it drifts from the OS setting — it's invoked once, from `Home`. Theme values themselves (`src/themes/index.ts`) are plain color-token objects (`lightTheme`, `darkTheme`) consumed via `useTheme()`.

## Backend (Supabase)

Schema and policies live as SQL migrations in `supabase/migrations/`, applied by the Supabase GitHub integration when a PR merges to `main` (CLI config in `supabase/config.toml`). Tables: `projects` (including `slug`, `role`, `period`, `highlight`, store links, and `banner_alt`), `domains`, `project_domains` (join table), `profile` (including `headline` and `cv_url`). To add or change content, see "Updating content" in [SETUP.md](SETUP.md). Row-level security is enabled on all public tables with `select`-only policies for `anon`/`authenticated` — the client has no write path and no auth flow; the anon key is meant to be public and access is restricted entirely by RLS. See [SECURITY.md](../SECURITY.md).

## CI/CD

- **`ci.yml`** — on every PR/push to `main`: `npm ci`, `npm audit`, `ts:check`, `lint`, `test`, a web export (`expo export --platform web`) as a build sanity check, and `deadcode` (knip). Formatting isn't a CI check — the `.githooks/pre-commit` hook runs `oxfmt` on staged files before they're ever committed.
- **`deploy-web.yml`** — on push to `main`, publishes the web build to GitHub Pages (`gh-pages` branch) via `npm run deploy`, whose `predeploy` refreshes the content snapshot, runs the static export, and adds `404.html` + `sitemap.xml` (`scripts/postexport-web.mjs`). Requires the `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` repo secrets (baked into the client bundle at build time — same public, RLS-scoped values as local `.env`). Live at [arberhh.github.io/mobile-portfolio](https://arberhh.github.io/mobile-portfolio/). `app.json`'s `experiments.baseUrl` (`/mobile-portfolio`) prefixes exported asset paths to match the Pages subpath.
- **`eas-update-on-release.yml`** — on push to `main`, runs an EAS Update workflow (`.eas/workflows/publish-update.yml`) to publish an OTA update to the production channel. `runtimeVersion` follows `appVersion` (`app.json`), so **bump `version` whenever native dependencies change** (e.g. adding `expo-router`): otherwise the update reaches installed binaries that lack the native code.
- **`claude.yml` / `claude-code-review.yml`** — Claude Code GitHub Actions for automated PR review/assistance.

Builds/submits (as opposed to OTA updates) are configured in `eas.json` (`development`, `preview`, `production` profiles) and run manually via `eas build`/`eas submit`.
