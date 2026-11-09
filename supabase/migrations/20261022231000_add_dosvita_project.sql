-- Add Dosvita (dosvita.app), my own web product: upload a CV, get it
-- extracted by Claude into structured data, and publish it as a portfolio
-- page. It's the full-stack counterpart to the mobile case studies. The
-- repo is private, so github stays null.
--
-- banner_url and images are screenshots of the live site, uploaded to the
-- `portofolio/dosvita/` storage path before this migration merges.

-- Resync the id sequences before inserting, same precaution as the earlier
-- project migrations.
select setval(pg_get_serial_sequence('public.projects', 'id'), (select max(id) from public.projects));
select setval(pg_get_serial_sequence('public.domains', 'id'), (select max(id) from public.domains));

insert into public.domains (title, icon)
values ('saas', 'cloud')
on conflict do nothing;

with new_project as (
  insert into public.projects (
    title,
    slug,
    role,
    period,
    highlight,
    short_description,
    long_description,
    personal,
    banner_url,
    banner_alt,
    images,
    tools_technologies,
    non_technical_contributions,
    techical_contributions
  )
  values (
    'Dosvita',
    'dosvita',
    'Personal product',
    'Aug 2026 – present',
    'Live at dosvita.app: a CV in, a published portfolio page out, with paid plans through Paddle',
    'A web app that turns a CV into a portfolio page: upload a PDF or Word file, Claude extracts it into structured data, and you edit and publish the result. Built with TanStack Start, Supabase and the Claude API, with subscriptions through Paddle.',
    'Dosvita is my own product, live at dosvita.app. You sign in with Google, upload a CV as a PDF or Word file, and Claude turns it into structured data that becomes a portfolio page you can edit, extend with projects and media, and publish at your own link. Pro plans run through Paddle. I built it end to end, from the Postgres data model to payments.',
    true,
    'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-banner.png',
    'Dosvita in the browser: the home page and an example portfolio',
    array[
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-home.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-example.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-example-2.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-pricing.png'
    ],
    array[
      'Web app: TanStack Start, TanStack Query, TypeScript in strict mode',
      'UI: Tailwind CSS v4, shadcn/ui',
      'Back end: Supabase (Postgres with row-level security, Google sign-in, Storage, Deno Edge Functions)',
      'AI: the Claude API with strict tool use, plus unpdf and mammoth to read PDF and Word files',
      'Payments: Paddle',
      'Delivery: GitHub Actions, migrations applied by the Supabase GitHub integration'
    ],
    array[
      'Came up with the product, named it, and took it from idea to a live, paid product.',
      'Defined the Free and Pro plans, the pricing page, and the terms, privacy and refund pages.',
      'Built it with Claude Code as an AI pair programmer, reviewing every pull request before merging.'
    ],
    array[
      'Built CV extraction as an Edge Function: reads PDF and Word files, calls Claude with a strict tool schema, and stores the structured result on the portfolio.',
      'Designed the Postgres schema (profiles, CV uploads, portfolios, subscriptions, usage log) with row-level security and locked-down writes.',
      'Integrated Paddle checkout and a signed webhook that keeps subscriptions in sync, and enforced plan limits for portfolios, uploads and media on the server.',
      'Kept a lapsed plan''s page online for a while, frozen and with a badge, instead of taking it down straight away.',
      'Added abuse limits on extraction: an in-flight cap, a failure cap, a daily free cap and per-IP limits.',
      'Moved data loading to TanStack Query and kept the Supabase admin client out of the browser bundle.',
      'Added SEO: share cards, structured data, a sitemap, robots and llms.txt.'
    ]
  )
  returning id
)
insert into public.project_domains (project_id, domain_id)
select new_project.id, d.id
from new_project
cross join public.domains d
where d.title in ('saas', 'ai');
