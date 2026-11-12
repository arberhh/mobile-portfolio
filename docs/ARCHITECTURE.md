# Architecture

A technical overview of how this app is put together — for local setup and running it, see [SETUP.md](SETUP.md).

## Stack

- **Expo (SDK 57) + React Native 0.86 + React 19**, written in TypeScript.
- **react-native-web** — the same codebase targets iOS, Android, and web (`npm run web`, or `npx expo export --platform web` for a static build).
- **Expo Router** for file-based routing, with static rendering on web (`web.output: "static"`): every route, including each project, is pre-rendered to its own HTML page.
- **Supabase** (`@supabase/supabase-js`) as the backend — Postgres + PostgREST, read-only from the client.
- **GitHub contributions** for the profile's activity graph, read from a public, CORS-enabled proxy of the contribution calendar (`github-contributions-api.jogruber.de`), since GitHub has no tokenless endpoint for it.
- **react-native-reanimated** / **react-native-gesture-handler** (with `react-native-reanimated-carousel`) for press springs and the project slideshow; **expo-image** for images, **expo-linear-gradient** for the hero band, **IBM Plex Sans / Mono** (`@expo-google-fonts`) for type, and **Ionicons** (`@expo/vector-icons`) behind a single `Icon` component.
- **oxlint + eslint**, **oxfmt**, **tsc**, **knip**, and **jest** for linting, formatting, type checking, dead-code detection, and tests — all but oxfmt run in CI (`.github/workflows/ci.yml`); oxfmt runs in a pre-commit hook.

## Project structure

```
app/                      # Expo Router routes (thin files re-exporting screens)
  _layout.tsx             # fonts, providers, theme sync, WebAppShell, Stack
  +html.tsx               # web HTML template (static rendering, pre-paint script, analytics)
  index.tsx               # / (Home)
  profile.tsx             # /profile
  project/[slug].tsx      # /project/<slug>, pre-rendered per snapshot project
  +not-found.tsx          # 404
scripts/                  # snapshot-content.mjs, postexport-web.mjs
src/
  screens/                # one folder per screen (projects=Home, project-detail, user=Profile, not-found)
  components/             # shared presentational components
  context/                # ThemeProvider / ThemeScope (light/dark theme state)
  hooks/                  # useAsync, useHydrated, useSystemThemeSync
  services/               # data layer: supabase-service, github-service
  content/                # build-time content snapshot (snapshot.json) + accessors
  util/                   # Supabase client (supabase/), slugify
  types/                  # shared types + generated Supabase Database type
  themes/                 # light/dark color tokens, spacing, radius, elevation
  constants/              # fonts, colors, site links, web CSS, motion
  common/                 # shared StyleSheet fragments (flex, spacing, text)
supabase/
  migrations/             # SQL migrations (schema, RLS policies, content)
  config.toml             # Supabase CLI project config
.github/                  # CI/CD workflows, Dependabot config
.eas/workflows/           # EAS workflow that publishes OTA updates
.githooks/                # pre-commit hook (oxfmt)
.claude/                  # Claude Code settings and project skills
docs/
  SETUP.md                # local dev setup
  ARCHITECTURE.md         # this file
AGENTS.md                 # code, content and process rules for AI agents
```

Path alias `@/*` (see `tsconfig.json`) maps to `src/*`, so imports read as `@/components`, `@/services`, etc.

## Data flow

1. `src/util/supabase/index.ts` lazily creates a single Supabase client (`getSupabase()`) from the `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` env vars, with the `react-native-url-polyfill` for `fetch`/URL support on native. It's lazy so importing it never throws when the env vars are absent (e.g. CI building without secrets), and it doesn't persist a session — the app is read-only with no auth.
2. `src/services/supabase-service` is the only place that talks to Supabase. It exposes `getProjects` (newest first by `created_at`) and `getProfile`, each of which:
   - runs a PostgREST query through a shared `runQuery` helper that normalizes Supabase's `{ data, error }` response into a thrown `Error` with a user-facing fallback message,
   - flattens the `project_domains` join table into a plain `domains` array (`withFlattenedDomains`),
   - coerces nullable Postgres columns to safe defaults (`toProject`), deriving a `slug` from the title when none is stored (`src/util/slugify`, which mirrors the migration's backfill),
   - prefetches banner URLs via `expo-image`'s `Image.prefetch` so they're warm before they're rendered.
3. `src/services/github-service` exposes `getContributions(username)`, which fetches the last year of the GitHub contribution calendar and normalizes it into `{ total, days }` for the profile's `ContributionGraph`.
4. `scripts/snapshot-content.mjs` (`npm run snapshot`) copies the current projects + profile into `src/content/snapshot.json`, which is committed. Without the env vars it keeps the committed snapshot and exits cleanly. `npm run deploy` refreshes its own copy before building, but doesn't commit it back, so the committed copy (what CI builds and the native app's first render use) only updates when someone runs `npm run snapshot` and commits. `src/content` parses it with the same `parseProjects` the service uses.
5. Screens call the service functions through `useAsync`, a small hook (`src/hooks/index.ts`) that tracks `{ data, loading, error }` for a fetcher function — this is the app's only data-fetching pattern, there is no separate query-caching library. Screens pass the snapshot as the initial value (`hasInitialData`), so content renders immediately, the fetch only refreshes it, and a failed refresh keeps the snapshot rather than showing an error. The contribution graph has no snapshot, so it shows an empty grid while loading and renders nothing if the fetch fails.
6. Types for the Supabase schema (`src/types/supabase.ts`) are generated from the database; hand-written domain types (`Project`, `Profile`, `Domain`, …) in `src/types/index.ts` derive from them with `Pick`/mapped types rather than being redefined by hand.

## Screens & navigation

Routes live in `app/` (Expo Router) and re-export screens from `src/screens`:

- **`/`** (`src/screens/projects`) — opens with an `Intro` (an always-navy terminal window with name, headline, intro, and `ContactLinks` from the profile), then lists projects (`getProjects`) in a `SectionList` with two sections: work (`$ ls ./work`) and personal (`$ ls ./personal`, rows with `personal = true`); an empty section is left out. Each `Project` card shows its banner, role · period, a one-line highlight, and domain tags, and is a `<Link>` (a real `<a href>` on web) to its project page.
- **`/project/[slug]`** (`src/screens/project-detail`) — finds its project by slug in the (snapshot-seeded) `getProjects` list, renders its slideshow (with a full-screen viewer), role/period/highlight, links (Website, App Store, Google Play, Source — each only when set, the first one as the primary button), description, tools (`"Area: tools"` entries become labelled rows), and the product/tech contribution lists. `generateStaticParams` pre-renders one page per snapshot project.
- **`/profile`** (`src/screens/user`) — the profile (`getProfile`): a navy profile card (photo, name, headline, contact links — Email, LinkedIn, GitHub, and CV when `cv_url` is set), the `about_me` text (`[label](url)` links become real links via `LinkedText`), main technologies, and the GitHub contribution graph for the profile's `github` username.
- **`+not-found`** — a navy `bash` window with a link home; exported as `404.html` for GitHub Pages.

Each screen sets its own `<title>`, description, canonical and Open Graph tags through `<PageHead>` (`expo-router/head`), so shared links preview the right page. The `Header` carries a back/profile button and the theme toggle. Back buttons call `router.back()`, or `router.replace("/")` when a deep link opened the screen with no history.

## Web-specific behavior

React Native's platform-extension resolution (`.web.tsx`) is used instead of scattering `Platform.OS === "web"` checks through shared components — see `web-app-shell`, `enter`, `caret` and `use-system-theme-sync/show-theme`:

- `src/components/web-app-shell/index.tsx` (native default) is a no-op passthrough.
- `index.web.tsx` wraps the whole router stack (from `app/_layout.tsx`) with a persistent sidebar (Projects/Profile) and a fixed-width reading column, shown as a window on a sky backdrop (with a dot grid) at 900px and up and full width below. The markup is identical at every width; a media query (`WEB_SHELL_CSS` in `src/constants/web.ts`, injected by `app/+html.tsx`) shows the sidebar above 900px. It's CSS rather than `useWindowDimensions` because static HTML is rendered without a window, and a JS-measured layout would never hydrate cleanly. Card hover/press styles (`PROJECT_CARD_CSS`) are CSS for the same reason.

The same constraint is why icons go through `src/components/icon`: glyph rendering depends on the icon font having loaded, which differs between server and client, so on web the glyph renders right after hydration (`useHydrated`) in a same-size box. On web, fonts don't gate rendering either (`app/_layout.tsx` only shows a spinner on native), so the static HTML contains the real page.

`app/+html.tsx` also adds the site-wide meta tags (theme colour per scheme, Open Graph site name, Twitter card) and the Google Analytics tag. `scripts/postexport-web.mjs` runs after the export: it copies the not-found page to `404.html`, removes router files that are useless on a static host (`_sitemap.html`, the unfilled `project/[slug].html`), and writes `sitemap.xml` and `robots.txt` from the snapshot.

### First paint and motion

The exported HTML is always dark. `app/+html.tsx` runs a tiny inline script before first paint: if the OS prefers light it sets `data-theme-pending` on `<html>`, which hides the shell (`WEB_SHELL_CSS`) so there is no dark flash, and a timeout removes the attribute after 1.5s even if the bundle never loads (a `<noscript>` style keeps the page visible without JavaScript). `useSystemThemeSync` applies the theme, clears the attribute and sets `data-theme-ready`, and only then do colour transitions apply. Entrance animations (`src/constants/motion.ts`, shared `src/components/enter`) are CSS keyframes keyed off `data-enter`, paused while the page is pending and disabled by `prefers-reduced-motion`; the terminal caret blinks through the same CSS. On native, presses use Reanimated springs that respect the system's reduced-motion setting.

## Theming

`src/context/index.tsx` implements a `ThemeProvider` backed by `useReducer` with a single `TOGGLE_THEME` action, defaulting to dark (`darkState`). `useSystemThemeSync` (`src/hooks/use-system-theme-sync`) is invoked once, from `AppStack` in `app/_layout.tsx`, so it runs on whichever route opens first: it matches the OS scheme once after mount, then listens to `Appearance.addChangeListener` and toggles when the OS setting changes. The header's `ThemeToggle` flips the theme manually, and a manual choice holds until the OS setting next changes. Theme values themselves (`src/themes/index.ts`) are plain color-token objects (`lightTheme`, `darkTheme`) consumed via `useTheme()`, alongside spacing, radius and card-elevation scales. `ThemeScope` re-provides the context with a given theme, which is how the intro, profile card and 404 windows stay navy on a light page. Raspberry is limited to a handful of roles, and every text pair passes WCAG AA.

## Backend (Supabase)

Schema, policies and content live as SQL migrations in `supabase/migrations/`, applied by the Supabase GitHub integration when a PR merges to `main` (CLI config in `supabase/config.toml`). Tables: `projects` (including `slug`, `role`, `period`, `highlight`, store links, `website_url`, `github`, `personal` and `banner_alt`), `domains`, `project_domains` (join table), `profile` (including `headline`, `intro`, `about_me`, `main_techs` and `cv_url`). Images are served from the public `portofolio` storage bucket. To add or change content, see "Updating content" in [SETUP.md](SETUP.md). Row-level security is enabled on all public tables with `select`-only policies for `anon`/`authenticated` — the client has no write path and no auth flow; the anon key is meant to be public and access is restricted entirely by RLS. See [SECURITY.md](../SECURITY.md).

## CI/CD

- **`ci.yml`** — on every PR/push to `main`: `npm ci`, a dependency audit (`audit-ci`, failing on high/critical advisories except those allowlisted with a reason in `audit-ci.jsonc`), `ts:check`, `lint`, `test`, a web export (`expo export --platform web`) as a build sanity check, and `deadcode` (knip). Formatting isn't a CI check — the `.githooks/pre-commit` hook (enabled by `npm ci` through the `prepare` script) runs `oxfmt` on staged files before they're ever committed.
- **`codeql.yml`** — CodeQL static analysis of the JS/TS source on every PR/push to `main` and weekly.
- **`deploy-web.yml`** — on push to `main`, publishes the web build to GitHub Pages (`gh-pages` branch) via `npm run deploy`, whose `predeploy` refreshes the content snapshot, runs the static export, and runs `scripts/postexport-web.mjs` (`404.html`, `sitemap.xml`, `robots.txt`). Requires the `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` repo secrets (baked into the client bundle at build time — same public, RLS-scoped values as local `.env`). Live at [arberhh.github.io/mobile-portfolio](https://arberhh.github.io/mobile-portfolio/). `app.json`'s `experiments.baseUrl` (`/mobile-portfolio`) prefixes exported asset paths to match the Pages subpath; `SITE_URL` in `src/constants/links.ts` mirrors it.
- **`eas-update-on-release.yml`** — on push to `main`, runs an EAS Update workflow (`.eas/workflows/publish-update.yml`) to publish an OTA update to the production channel. Needs the `EXPO_TOKEN` secret. `runtimeVersion` follows `appVersion` (`app.json`), so **bump `version` whenever native dependencies change** (e.g. adding `expo-router`): otherwise the update reaches installed binaries that lack the native code.
- **`claude.yml` / `claude-code-review.yml`** — Claude Code GitHub Actions for automated PR review/assistance.
- **Dependabot** (`.github/dependabot.yml`) opens weekly PRs for npm and GitHub Actions updates, grouping the Expo and React Native packages.

Builds/submits (as opposed to OTA updates) are configured in `eas.json` (`development`, `preview`, `production` profiles) and run manually via `eas build`/`eas submit`.
