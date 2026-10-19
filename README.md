# mobile-portfolio

[![CI](https://github.com/arberhh/mobile-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/arberhh/mobile-portfolio/actions/workflows/ci.yml)
[![CodeQL](https://github.com/arberhh/mobile-portfolio/actions/workflows/codeql.yml/badge.svg)](https://github.com/arberhh/mobile-portfolio/actions/workflows/codeql.yml)

📱 Expo Portfolio: Showcase of 4 React Native apps. Clean, modular code. Features UI designs, animations. Ready for collaboration. Connect with me!

## <img width="30" height="30" src="https://img.icons8.com/color/48/expo.png" alt="expo"/> Try it now

The web build is live at **[arberhh.github.io/mobile-portfolio](https://arberhh.github.io/mobile-portfolio/)** — no app or simulator needed.

Since May 2026, Expo Go only opens EAS Update links for the project owner or their org members, so scanning a QR code no longer works for outside visitors.

Want to run it yourself? See [docs/SETUP.md](docs/SETUP.md) for local setup and running instructions.

## 📸 Screenshots

<p align="center">
  <img src="https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-mobile.png" alt="Home screen on mobile web" width="260" />
  <img src="https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-web.png" alt="Home screen on wide web, with sidebar navigation" width="420" />
  <img src="https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-profile-web.png" alt="Profile screen on wide web" width="420" />
</p>

## 📁 Project Structure Overview

This project keeps code files organized in a TypeScript Expo project. It splits things into reusable pieces, screens for each view, and file-based routes (Expo Router) to move between them. The context folder holds app-wide state, and themes keep the styling the same everywhere.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a full technical breakdown — data flow, web-specific behavior, theming, and CI/CD.

## 💾 Supabase

This app uses Supabase as its backend. It's not just a demo — it shows I can set up and use a real backend. I use Supabase to store and show my projects, domains, and profile info.

## 🔒 Security

This repo is checked automatically so it's safe to clone and run:

- **[CodeQL](.github/workflows/codeql.yml)** static analysis scans the JS/TS source on every push, PR, and weekly, for common vulnerability patterns.
- **[Dependabot](.github/dependabot.yml)** opens weekly PRs for outdated/vulnerable npm and GitHub Actions dependencies, and raises alerts for known CVEs.
- **`npm audit`** runs in [CI](.github/workflows/ci.yml) on every PR/push, gated at high severity.
- The app itself only holds a public Supabase URL and anon key (`EXPO_PUBLIC_*` env vars), scoped by row-level security policies to public, read-only access on the `projects`, `domains`, and `profile` tables — there's no user auth or write path in the client.

See [SECURITY.md](SECURITY.md) for how to report a vulnerability.

---

Expo icon by [Icons8](https://icons8.com).
