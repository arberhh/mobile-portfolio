-- Banners that fit the sky, navy and pink redesign. AQ Shop and ArcadeQuest
-- now show their real app screenshots on navy instead of a yellow and a black
-- card. The Portfolio App banner and gallery show the redesigned app itself;
-- the old ones showed the lime design it replaces. Each gallery also drops
-- the screenshots it listed twice. Images are uploaded under new names, since
-- the storage CDN keeps serving a replaced file.

update public.projects
set banner_url = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-shop-banner-navy.png',
    banner_alt = 'Two AQ Shop App Store screenshots on navy: featured game deals and creator videos',
    images = array[
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/shop-1.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/shop-3.png'
    ]
where slug = 'aq-shop';

update public.projects
set banner_url = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/arcadequest-banner-navy.png',
    banner_alt = 'Three ArcadeQuest screens on navy: kill-race quests, the cash store and playing with streamers',
    images = array[
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-1.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-2.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-3.png'
    ]
where slug = 'arcadequest';

update public.projects
set banner_url = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/banner-sky.png',
    banner_alt = 'The redesigned portfolio on a dotted sky: the desktop site in a browser window and the home screen on a phone',
    images = array[
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-mobile-v3.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-web-v3.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-profile-web-v3.png'
    ]
where slug = 'mobile-portfolio';

update public.projects
set images = array[
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-1.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-2.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-3.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-4.png'
    ]
where slug = 'twig';
