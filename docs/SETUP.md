# Local setup & running

## Prerequisites

- [Node.js](https://nodejs.org/) 20 (matches the version CI runs against)
- npm
- [Expo Go](https://expo.dev/go) on your phone, and/or Xcode (iOS Simulator) / Android Studio (Android Emulator)
- Optional: the project's Supabase URL + anon key. This app is backed by a specific database seeded with the actual portfolio content, so live data needs that instance rather than a fresh Supabase project. Without the keys the app still runs from the committed content snapshot (the live refresh just logs an error), but you need them to see content changes or to run `npm run snapshot`.

## Install

```bash
git clone https://github.com/arberhh/mobile-portfolio.git
cd mobile-portfolio
npm ci
```

## Environment variables

To use live data, copy the example env file and fill in the project's Supabase URL and anon key:

```bash
cp .env.example .env
```

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## Run

```bash
npm start        # opens Expo dev tools — scan the QR code with Expo Go
npm run ios      # launch in the iOS Simulator
npm run android  # launch in the Android Emulator
npm run web      # launch in a browser
npm run snapshot # refresh src/content/snapshot.json from Supabase (needs the env vars)
```

## Checks

Run the same checks CI runs before opening a PR:

```bash
npm run ts:check                # TypeScript
npm run lint                    # oxlint + ESLint
npm run test                    # Jest
npm run deadcode                # knip — unused exports/deps
npx expo export --platform web  # static web build (works without the Supabase env vars)
```

Formatting isn't one of them — a pre-commit hook already runs `oxfmt` on staged files and re-stages them, so it's handled automatically on every commit. Run `npm run format` yourself only if you want to see the fix before committing.

## Updating content

Projects and the profile live in Supabase, and every change is a migration in `supabase/migrations/`, never an edit in the dashboard.

1. **Write a migration** that inserts or updates the row. A project has a unique `slug` (its URL, `/project/<slug>`), and optionally `role`, `period`, a one-line `highlight`, `app_store_url`, `play_store_url`, and `banner_alt`. Fields left null aren't shown. The profile has `headline` and `cv_url`.
2. **Upload images** to the `portofolio` storage bucket. Card banners are **1200×450 PNGs (8:3)**: the card frame is a fixed 8:3, so other ratios show empty bands. For example:
   ```bash
   supabase storage cp banner-card.png ss:///portofolio/<project>/banner-card.png --experimental --linked
   ```
3. **Merge the PR.** The Supabase GitHub integration applies new migrations when it merges to `main`, so there's no manual `supabase db push`. That's why the images go up first: the migration can reference them the moment it runs.
4. **Refresh the snapshot** after the migration has landed, with `npm run snapshot`, and commit `src/content/snapshot.json`. Each web deploy rebuilds its own copy from Supabase, but doesn't commit it back, so the committed copy is what CI builds and the native app's first render use. If the deploy triggered by the merge builds before the migration is applied, the next deploy catches up, and the browser's live refresh shows current data in the meantime.
