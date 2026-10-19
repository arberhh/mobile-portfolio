# Local setup & running

## Prerequisites

- [Node.js](https://nodejs.org/) 20 (matches the version CI runs against)
- npm
- [Expo Go](https://expo.dev/go) on your phone, and/or Xcode (iOS Simulator) / Android Studio (Android Emulator)
- Access to the project's Supabase instance (URL + anon key) — this app is backed by a specific database seeded with the actual portfolio content, so it needs to connect to that instance rather than a fresh Supabase project

## Install

```bash
git clone https://github.com/arberhh/mobile-portfolio.git
cd mobile-portfolio
npm ci
```

## Environment variables

Copy the example env file and fill in the project's Supabase URL and anon key:

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
```

## Checks

Run the same checks CI runs before opening a PR:

```bash
npm run ts:check                # TypeScript
npm run lint                    # ESLint
npm run test                    # Jest
npm run deadcode                # knip — unused exports/deps
npx expo export --platform web  # web build
```

Formatting isn't one of them — a pre-commit hook already runs `oxfmt` on staged files and re-stages them, so it's handled automatically on every commit. Run `npm run format` yourself only if you want to see the fix before committing.
