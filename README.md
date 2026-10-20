# mobile-portfolio

[![CI](https://github.com/arberhh/mobile-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/arberhh/mobile-portfolio/actions/workflows/ci.yml)
[![CodeQL](https://github.com/arberhh/mobile-portfolio/actions/workflows/codeql.yml/badge.svg)](https://github.com/arberhh/mobile-portfolio/actions/workflows/codeql.yml)

📱 The portfolio of Arber Haxhimusa, a senior React Native engineer: case studies for four production apps (Nectar, AQ Shop, ArcadeQuest, Twig) and for this app itself, built with Expo for iOS, Android, and web.

- **One codebase, three platforms**: Expo Router with `react-native-web`.
- **Linkable web pages**: every project has its own URL (e.g. `/project/nectar`), pre-rendered to HTML with its own title and link preview.
- **Real backend**: content lives in Supabase, with a committed snapshot so pages render instantly and offline-safe.
- **Dark / light themes** and a sidebar layout on wide screens.

## <img width="30" height="30" src="https://img.icons8.com/color/48/expo.png" alt="expo"/> Try it now

The web build is live at **[arberhh.github.io/mobile-portfolio](https://arberhh.github.io/mobile-portfolio/)** — no app or simulator needed.

Since May 2026, Expo Go only opens EAS Update links for the project owner or their org members, so scanning a QR code no longer works for outside visitors.

Want to run it yourself? See [docs/SETUP.md](docs/SETUP.md) for local setup and running instructions.

## 📸 Screenshots

<p align="center">
  <img src="https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-mobile-v2.png" alt="Home on mobile web: intro, contact links, and project cards" width="260" />
  <img src="https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-web-v2.png" alt="Home on wide web, with sidebar navigation" width="420" />
  <img src="https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-profile-web-v2.png" alt="Profile on wide web" width="420" />
</p>

## 📁 Project Structure Overview

This project keeps code files organized in a TypeScript Expo project. Routes live in `app/` (Expo Router) and re-export the screens in `src/screens`, which are built from reusable pieces in `src/components`. The context folder holds app-wide state, and themes keep the styling the same everywhere.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a full technical breakdown — data flow, web-specific behavior, theming, and CI/CD.

## 💾 Supabase

This app uses Supabase as its backend. It's not just a demo — it shows I can set up and use a real backend. I use Supabase to store and show my projects, domains, and profile info. A copy of that content is committed as a snapshot (`src/content/snapshot.json`), so the app and the pre-rendered web pages have real content from the first render, and the live data refreshes it afterwards.

## 🔒 Security

This repo is checked automatically so it's safe to clone and run:

- **[CodeQL](.github/workflows/codeql.yml)** static analysis scans the JS/TS source on every push, PR, and weekly, for common vulnerability patterns.
- **[Dependabot](.github/dependabot.yml)** opens weekly PRs for outdated/vulnerable npm and GitHub Actions dependencies, and raises alerts for known CVEs.
- **`npm audit`** runs in [CI](.github/workflows/ci.yml) on every PR/push, gated at high severity.
- The app itself only holds a public Supabase URL and anon key (`EXPO_PUBLIC_*` env vars), scoped by row-level security policies to public, read-only access on the `projects`, `domains`, `project_domains`, and `profile` tables — there's no user auth or write path in the client.

See [SECURITY.md](SECURITY.md) for how to report a vulnerability.

---

Expo icon by [Icons8](https://icons8.com).
