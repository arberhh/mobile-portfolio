-- Point every project card at a 1200x450 (8:3) banner that fills the card
-- frame, plus alt text describing it. All images were uploaded alongside
-- the originals, which stay in storage untouched:
--   - Twig and ArcadeQuest: their existing artwork, re-cropped / re-scaled.
--   - Mobile Portfolio: the wordmark re-exported with the corrected spelling.
--   - Nectar: its App Store screenshots, replacing the parent company's
--     (Jubilee) logo, which didn't name the product.
--   - AQ Shop: its own App Store screenshots, instead of sharing
--     ArcadeQuest's banner.
update public.projects as p
set banner_url = v.banner_url, banner_alt = v.banner_alt
from (
  values
    (
      'Mobile Portfolio',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/banner-card.png',
      'mobile-portfolio wordmark under a lime terminal prompt, captioned "Rebuilt with Claude Code"'
    ),
    (
      'Nectar',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/jubilee/nectar-card.png',
      'Three Nectar App Store screenshots: a loveprint profile, relationship questions, and choosing what you''re looking for'
    ),
    (
      'AQ Shop',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/aq-shop-card.png',
      'Four AQ Shop App Store screenshots: featured game deals, a game page with a Buy Now button, creator videos, and weekly new games'
    ),
    (
      'ArcadeQuest',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/arcadequest/banner-card.png',
      'ArcadeQuest logo on a dark background'
    ),
    (
      'Twig',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/twig/banner-card.png',
      'Twig logo with the tagline "Your bank of things" on a sky-blue background'
    )
) as v (title, banner_url, banner_alt)
where p.title = v.title;
