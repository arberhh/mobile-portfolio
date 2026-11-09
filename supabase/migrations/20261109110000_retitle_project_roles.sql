-- Role titles to match the CV: mobile work is "Mobile Engineer", the
-- ArcadeQuest platform (apps and services) is "Software Engineer".

update public.projects set role = 'Senior Mobile Engineer · JubileeMedia' where slug = 'nectar';
update public.projects set role = 'Mobile Engineer · ArcadeQuest' where slug = 'aq-shop';
update public.projects set role = 'Software Engineer · ArcadeQuest' where slug = 'arcadequest';
update public.projects set role = 'Mobile Engineer · Twig, London' where slug = 'twig';
