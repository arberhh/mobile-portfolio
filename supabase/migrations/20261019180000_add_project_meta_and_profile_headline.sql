-- Fields surfaced by the portfolio review: each project gets a stable URL
-- slug (Expo Router deep links /project/<slug>), the role and period it
-- covered, one headline outcome, public store links, and alt text for its
-- banner. The profile gets a one-line headline for the Home hero and an
-- optional CV link. Everything is nullable so the client renders a field
-- only once it has content.

alter table public.projects
  add column if not exists slug text,
  add column if not exists role text,
  add column if not exists period text,
  add column if not exists highlight text,
  add column if not exists app_store_url text,
  add column if not exists play_store_url text,
  add column if not exists banner_alt text;

update public.projects
set slug = trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
where slug is null and title is not null;

create unique index if not exists projects_slug_key on public.projects (slug);

alter table public.profile
  add column if not exists headline text,
  add column if not exists cv_url text;

-- '#technology' was on most cards, so it didn't tell projects apart. Drop
-- the links (and the domain itself) so cards keep only the specific tags.
delete from public.project_domains
where domain_id in (select id from public.domains where title = 'technology');

delete from public.domains where title = 'technology';
