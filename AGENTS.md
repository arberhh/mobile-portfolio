# AGENTS.md

## Code rules

- **Simple over clever.** Don't add a hook, layer or helper unless something actually reuses it. Match the style of the code around it.
- **No `any`, no `as` casts to silence errors, and never suppress lint or type errors.** Fix the cause. Derive types from `src/types/supabase.ts`.
- **Platform differences** go in `.web.tsx` / `.ios.tsx` files, not inline `Platform.OS`, unless the difference is one line.
- **Supabase is only called from `src/services/supabase-service`.** Screens get data through `useAsync`. Don't add a query library.
- **Expo APIs change every SDK.** Check the v57 docs (https://docs.expo.dev/versions/v57.0.0/) rather than relying on memory.
- **Comments** are short and only explain a non-obvious why.
- **Static web:** every route is pre-rendered from `src/content/snapshot.json`, so the server render and the client's first render must match. Don't read window size in render (the shell's layout is CSS, in `WebAppShell`), and always render icons through `Icon` (`src/components/icon`).

## Content

- Projects and the profile change only through SQL migrations in `supabase/migrations/`. The Supabase GitHub integration applies them when a PR merges, and there's no manual `db push`.
- Before the PR merges, upload any image a migration references with `supabase storage cp --experimental --linked`.
  - Card banners are 1200×450 PNGs.
  - Give a replaced image a new file name, because the CDN keeps serving the old file.
- Home sorts projects by `created_at`, newest first. After changing content, run `npm run snapshot` and commit the result.
- Text in `profile.about_me` can contain `[label](url)` links.

## Process

- Don't commit, push, branch or open PRs unless asked. Follow the `commit-conventions` skill. Never add `Co-Authored-By` or "Generated with Claude Code" to commits or PRs.
- CI runs `ts:check`, `lint`, `test`, the web export and `deadcode`. Run these locally only when you need their output.
- To see a change, use the `run-expo` skill. Bump `version` in `app.json` when native dependencies change, because OTA updates are matched to `appVersion`.
