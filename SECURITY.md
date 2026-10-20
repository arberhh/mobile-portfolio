# Security Policy

## Supported Versions

This is a single-instance portfolio app, not a versioned library — only the code on `main` is supported.

## Scope

The client ships a public Supabase URL and an anon key (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`). These are meant to be public: access is restricted server-side by Postgres row-level security policies that grant read-only access to the `projects`, `domains`, `project_domains`, and `profile` tables. There is no authentication or write path exposed to the client. The committed content snapshot (`src/content/snapshot.json`) holds only what those public tables already expose.

## Reporting a Vulnerability

If you find a vulnerability (e.g. an RLS policy that over-exposes data, or a way to write to the database from the client), please open a private report via [GitHub Security Advisories](https://github.com/arberhh/mobile-portfolio/security/advisories/new) rather than a public issue. Include steps to reproduce. This is a personal project maintained in spare time, so response times aren't guaranteed, but reports will be looked at as soon as possible.
