-- A project can link to its live site, shown on its page next to the store
-- and source links. Dosvita is the first: it's a web app with no store
-- listing and a private repo, so it had no link at all.

alter table public.projects add column website_url text;

update public.projects set website_url = 'https://dosvita.app' where slug = 'dosvita';
