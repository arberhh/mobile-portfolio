-- Trim the repetition on the project pages, which show the highlight, the
-- long description and three lists one after another. Each now has one job:
--   highlight            the headline outcome (also on the card)
--   long_description     context: what the product is and what I owned
--   tools_technologies   the stack, grouped by area, names only
--   *_contributions      what I did, without restating the stack or highlight
-- `aproach` isn't shown anywhere, so AQ Shop's is folded into its
-- description. short_description (the page's meta description) stays.
-- "Mobile Portfolio" becomes "Portfolio App": it runs on iOS, Android and the
-- web, and the slug stays the same so its URL doesn't change.

update public.projects
set
  long_description = 'Nectar is JubileeMedia''s dating app for iOS and Android. I set it up from the ground up and own its architecture and delivery: the React Native client, its typed GraphQL layer over Hasura, and the pipeline that ships it through Development, Staging and Production to the App Store and Google Play. I work with the backend and QA teams to validate APIs, investigate data issues and take features from concept to production.',
  tools_technologies = array[
    'Client: React Native, Expo, TypeScript',
    'API: GraphQL with Hasura, Apollo Client and GraphQL Code Generator',
    'Auth and payments: Firebase Authentication, RevenueCat',
    'Messaging: Pushwoosh, OneSignal, Firebase, Sendbird',
    'Analytics and rollouts: Mixpanel, Firebase Remote Config',
    'Delivery: Expo, GitHub Actions'
  ],
  techical_contributions = array[
    'Organized the app into scalable modules for components, hooks and services, with centralized configuration per environment.',
    'Built CI/CD that automates builds and App Store and Google Play releases.',
    'Made every GraphQL query and mutation fully typed, generated from the schema.',
    'Built sign-in for iOS and Android, and the subscription and payment flows.',
    'Integrated push notifications and in-app messaging across four providers.',
    'Tracked user behavior, conversion funnels and feature performance, and ran A/B tests and staged rollouts.'
  ]
where slug = 'nectar';

update public.projects
set
  long_description = 'AQ Shop was ArcadeQuest''s app for discovering and buying indie games. I developed the app, keeping the architecture modular and the code clean so the team could ship features quickly while it stayed easy to extend, test and support.',
  aproach = null,
  tools_technologies = array[
    'Client: React Native, TypeScript',
    'Payments: RevenueCat, Stripe',
    'Analytics and monitoring: Mixpanel, Sentry',
    'Platforms: Android Studio, Xcode'
  ],
  techical_contributions = array[
    'Built a Product Hunt-style discovery feed for new Steam releases.',
    'Built live game showcases with real-time user engagement.',
    'Added discounted game listings with direct in-app purchases.',
    'Shipped and maintained the app on iOS and Android.'
  ]
where slug = 'aq-shop';

update public.projects
set
  long_description = 'ArcadeQuest makes companion apps for Fortnite players. I developed the React Native apps and the services behind them: player statistics, live item shop data, quests and subscriptions in the app, backed by Node.js APIs and Supabase Edge Functions.',
  tools_technologies = array[
    'Client: React Native, TypeScript',
    'Back end: Node.js, Supabase Edge Functions',
    'Games: Unity',
    'Payments: RevenueCat, Stripe',
    'Analytics and monitoring: Mixpanel, UXCam, Sentry'
  ],
  techical_contributions = array[
    'Built player statistics, live item shop updates, quests and subscriptions.',
    'Wrote Node.js APIs that fetch and serve Fortnite item shop data.',
    'Wrote Supabase Edge Functions for external API calls, data processing and scheduled jobs.',
    'Built a mini-games system with Node.js and Unity to drive engagement.',
    'Managed iOS and Android builds, releases and production updates.'
  ]
where slug = 'arcadequest';

update public.projects
set
  long_description = 'At Twig in London I built and maintained features for the company''s React Native app on iOS and Android, from native integrations and production fixes to a full rebuild with a new design.',
  tools_technologies = array[
    'Client: React Native, React, JavaScript',
    'Native: Android and iOS SDKs',
    'Data: MongoDB'
  ],
  techical_contributions = array[
    'Integrated native SDKs on Android and iOS.',
    'Resolved critical production issues, including a pod versioning problem affecting iOS users.',
    'Helped rebuild the app with a new design, improving usability, performance and maintainability.',
    'Improved performance, reliability and responsiveness.',
    'Used product data to improve conversion and engagement.'
  ]
where slug = 'twig';

update public.projects
set
  title = 'Portfolio App',
  long_description = 'This app, picked back up in August 2026 after about two years. I rebuilt it with Claude Code as an AI pair programmer: I planned the work in Linear, directed the agent session by session, and reviewed every pull request before merging. The tooling around that loop, not just the redesign, became the reusable part.',
  tools_technologies = array[
    'App: React Native (Expo SDK 57), TypeScript, Expo Router, react-native-web',
    'Content: Supabase (Postgres, PostgREST, row-level security), managed through migrations',
    'AI workflow: Claude Code with custom skills, Linear through its MCP server, the Claude Code GitHub App',
    'Quality: GitHub Actions running TypeScript, oxlint, ESLint, Jest, Knip, a dependency audit and CodeQL, plus Dependabot',
    'Delivery: EAS Update for over-the-air updates, GitHub Pages for the web build'
  ],
  non_technical_contributions = array[
    'Scoped the rebuild before any code was written, then broke it into Linear epics, tickets and subtickets.',
    'Planned the "Technical Terminal" redesign: dark, monospace, with a lime accent.'
  ],
  techical_contributions = array[
    'Wrote reusable Claude Code skills: commit-conventions (commit, PR and branch naming with Linear ticket IDs), design-handoff-sync (a written design spec into code and a PR, without Figma) and run-expo (launches and drives the app for local checks).',
    'Built the CI pipeline from scratch and set up automated pull request review.',
    'Added first-class web support: pre-rendered pages with their own URL and link preview for every project, a .web.tsx split for web-only layout, and automated deploys to GitHub Pages.',
    'Upgraded Expo SDK 54 to 57 and moved secrets out of source into environment variables.',
    'Moved all content into versioned Supabase migrations, so adding a project, like this one, is a migration.'
  ]
where slug = 'mobile-portfolio';
