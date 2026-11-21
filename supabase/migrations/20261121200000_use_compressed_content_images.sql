-- Lighter content images. Banners are re-encoded as JPEG (they're also each
-- project page's og:image, and JPEG previews everywhere), and gallery
-- screenshots and the profile photo as WebP, with screenshots capped at 1440px
-- tall. Same pixels otherwise; about 4.7 MB down to 1.3 MB. Twig's banner
-- stays PNG, which is already smaller. The files are uploaded under new names,
-- since the storage CDN keeps serving a replaced file. The old PNGs stay in the
-- bucket.

update public.projects set banner_url = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-banner.jpg'
where slug = 'multimodal-rag';

update public.projects set banner_url = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-banner.jpg'
where slug = 'dosvita';

update public.projects set banner_url = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/banner-sky.jpg'
where slug = 'mobile-portfolio';

update public.projects set banner_url = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-card.jpg'
where slug = 'nectar';

update public.projects set banner_url = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-shop-banner-navy.jpg'
where slug = 'aq-shop';

update public.projects set banner_url = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/arcadequest-banner-navy.jpg'
where slug = 'arcadequest';

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-home.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-home.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-documents.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-documents.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-answer.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-answer.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-chats.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-chats.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-home.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-home.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-example.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-example.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-example-2.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-example-2.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-pricing-trial.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/dosvita/web-pricing-trial.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-mobile-v3.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-mobile-v3.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-web-v3.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-home-web-v3.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-profile-web-v3.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/screen-profile-web-v3.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-1.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-1.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-2.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-2.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-3.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-3.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-4.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-4.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-5.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-5.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/shop-1.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/shop-1.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/shop-3.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/shop-3.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-1.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-1.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-2.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-2.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-3.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-3.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-1.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-1.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-2.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-2.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-3.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-3.webp');

update public.projects set images = array_replace(images, 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-4.png',
  'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/twig-4.webp');

update public.profile set profile_picture = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/profile/profile-pic.webp'
where id = 1;
