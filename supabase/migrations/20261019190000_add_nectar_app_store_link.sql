-- Nectar is the only project with a public store listing; the others are
-- delisted or were never public, so their store columns stay null and the
-- links don't render.
update public.projects
set app_store_url = 'https://apps.apple.com/us/app/nectar-dating-compatibility/id6476018063'
where title = 'Nectar';
