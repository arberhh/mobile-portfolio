-- The repo moved from arberhh/mobile-portofolio to arberhh/mobile-portfolio.
-- GitHub redirects the old repo URL, but store the canonical one.
--
-- The card now uses an 8:3 banner (banner-card.png); banner.png stays the
-- 1.91:1 Open Graph image. Both were re-exported with the corrected
-- "mobile-portfolio" wordmark and must be uploaded to the
-- portofolio/mobile-portfolio/ storage path before this runs. The bucket
-- keeps its old name: it's internal, and renaming it would change every
-- image URL.
update public.projects
set
  github = 'https://github.com/arberhh/mobile-portfolio',
  banner_url = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/mobile-portfolio/banner-card.png',
  banner_alt = 'mobile-portfolio wordmark: a lime terminal prompt above the text "Rebuilt with Claude Code"'
where title = 'Mobile Portfolio';
