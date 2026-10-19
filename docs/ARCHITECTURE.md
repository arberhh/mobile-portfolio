# Architecture

A technical overview of how this app is put together — for local setup and running it, see [SETUP.md](SETUP.md).

## Stack

- **Expo (SDK 57) + React Native 0.86 + React 19**, written in TypeScript.
- **react-native-web** — the same codebase targets iOS, Android, and web (`npm run web`, or `npx expo export --platform web` for a static build).
- **React Navigation** (`@react-navigation/native-stack`) for screen routing.
- **Supabase** (`@supabase/supabase-js`) as the backend — Postgres + PostgREST, read-only from the client.
- **react-native-reanimated** / **react-native-gesture-handler** for animation and gestures (the project carousel, slideshow).
- **oxlint + eslint**, **oxfmt**, **tsc**, **knip**, and **jest** for linting, formatting, type checking, dead-code detection, and tests — all wired into CI (`.github/workflows/ci.yml`).

## Project structure

```
App.tsx                  # entry: fonts, providers, NavigationContainer
src/
  navigation/             # native-stack route table (Home, ProjectDetails, User)
  screens/                # one folder per screen (projects=Home, project-detail, user)
  components/             # shared presentational components
  context/                # ThemeProvider (light/dark theme state)
  hooks/                  # useAsync, useIsWideWeb, useSystemThemeSync
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
3. `scripts/snapshot-content.mjs` (`npm run snapshot`) copies the current projects + profile into `src/content/snapshot.json`, which is committed and refreshed before every web deploy. `src/content` parses it with the same `parseProjects` the service uses.
4. Screens call the service functions through `useAsync`, a small hook (`src/hooks/index.ts`) that tracks `{ data, loading, error }` for a fetcher function — this is the app's only data-fetching pattern, there is no separate query-caching library. Screens pass the snapshot as the initial value (`hasInitialData`), so content renders immediately, the fetch only refreshes it, and a failed refresh keeps the snapshot rather than showing an error.
5. Types for the Supabase schema (`src/types/supabase.ts`) are generated from the database; hand-written domain types (`Project`, `Profile`, `Domain`, …) in `src/types/index.ts` derive from them with `Pick`/mapped types rather than being redefined by hand.

## Screens & navigation

`src/navigation/index.tsx` defines a native-stack with three routes:

- **Home** (`src/screens/projects`) — fetches and lists all projects (`getProjects`), renders `Project` cards in a `FlatList`.
- **ProjectDetails** (`src/screens/project-detail`) — finds its project in the (snapshot-seeded) `getProjects` list, renders its slideshow, description, and tech/contribution lists.
- **User** (`src/screens/user`) — fetches the profile (`getProfile`), renders the bio, tech stack, and social links (LinkedIn/GitHub/email via `Linking.openURL`).

`project-detail/index.tsx` splits its UI into a reusable `ProjectDetailContent` (takes `id` + `onBack`) and a route-level `ProjectDetailScreen` wrapper. This split exists so Home can render project details inline on wide web layouts (see below) without a second navigation stack.

## Web-specific behavior

React Native's platform-extension resolution (`.web.tsx`) is used instead of scattering `Platform.OS === "web"` checks through shared components — see `src/components/web-app-shell/`:

- `index.tsx` (native default) is a no-op passthrough.
- `index.web.tsx` renders a persistent sidebar (Home/Profile) and constrains content to a fixed reading width, but only above `WEB_WIDE_BREAKPOINT` (900px, `src/constants/web.ts`) — narrow web viewports fall back to the same single-column layout as native.

`useIsWideWeb` (`src/hooks/index.ts`) centralizes that `Platform.OS === "web" && width >= breakpoint` check. On wide web, `Home` shows project details in an overlay (`selectedProjectId` state) instead of navigating to a new stack screen, since a sidebar layout reads better with detail content swapped in place.

## Theming

`src/context/index.tsx` implements a `ThemeProvider` backed by `useReducer` with a single `TOGGLE_THEME` action, defaulting to dark (`darkState`). `useSystemThemeSync` (`src/hooks/use-system-theme-sync`) listens to `Appearance.addChangeListener` and toggles the theme when it drifts from the OS setting — it's invoked once, from `Home`. Theme values themselves (`src/themes/index.ts`) are plain color-token objects (`lightTheme`, `darkTheme`) consumed via `useTheme()`.

## Backend (Supabase)

Schema and policies live as SQL migrations in `supabase/migrations/`, applied via the Supabase CLI (`supabase/config.toml`). Tables: `projects`, `domains`, `project_domains` (join table), `profile`. Row-level security is enabled on all public tables with `select`-only policies for `anon`/`authenticated` — the client has no write path and no auth flow; the anon key is meant to be public and access is restricted entirely by RLS. See [SECURITY.md](../SECURITY.md).

## CI/CD

- **`ci.yml`** — on every PR/push to `main`: `npm ci`, `npm audit`, `ts:check`, `lint`, `test`, a web export (`expo export --platform web`) as a build sanity check, and `deadcode` (knip). Formatting isn't a CI check — the `.githooks/pre-commit` hook runs `oxfmt` on staged files before they're ever committed.
- **`deploy-web.yml`** — on push to `main`, builds the web export and publishes it to GitHub Pages (`gh-pages` branch) via `npm run deploy`. Requires the `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` repo secrets (baked into the client bundle at build time — same public, RLS-scoped values as local `.env`). Live at [arberhh.github.io/mobile-portofolio](https://arberhh.github.io/mobile-portofolio/). `app.json`'s `experiments.baseUrl` (`/mobile-portofolio`) prefixes exported asset paths to match the Pages subpath.
- **`eas-update-on-release.yml`** — on push to `main`, runs an EAS Update workflow (`.eas/workflows/publish-update.yml`) to publish an OTA update to the production channel.
- **`claude.yml` / `claude-code-review.yml`** — Claude Code GitHub Actions for automated PR review/assistance.

Builds/submits (as opposed to OTA updates) are configured in `eas.json` (`development`, `preview`, `production` profiles) and run manually via `eas build`/`eas submit`.
