-- The repo moved from arberhh/mobile-portofolio to arberhh/mobile-portfolio.
-- GitHub redirects the old repo URL, but store the canonical one.
update public.projects
set github = 'https://github.com/arberhh/mobile-portfolio'
where title = 'Mobile Portfolio';
