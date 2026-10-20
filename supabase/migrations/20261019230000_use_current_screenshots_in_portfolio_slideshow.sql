-- The Mobile Portfolio slideshow still showed the pre-redesign UI (no intro,
-- "Home" header, icon-only links). Swap in screenshots of the current site,
-- same three screens in the same order. The new files were uploaded next to
-- the old ones (-v2), which stay in storage untouched.
update public.projects
set images = array_replace(
  array_replace(
    array_replace(
      images,
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-mobile.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-mobile-v2.png'
    ),
    'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-web.png',
    'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-web-v2.png'
  ),
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-profile-web.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-profile-web-v2.png'
)
where title = 'Mobile Portfolio';
