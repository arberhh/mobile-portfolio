-- Content from the CV (Documents/arber/ARBER-HAXHIMUSA-CV.pdf, Sep 2026),
-- which is now also linked from the profile. Highlights are only set where
-- there's a stated outcome; the others stay null and don't render. Nectar's
-- figures are product-level metrics (MAU, retention) for the app, taken
-- from a JubileeMedia colleague's CV, not personal claims.

update public.profile
set
  headline = 'Senior Mobile Developer (React Native)',
  cv_url = 'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/profile/arber-haxhimusa-cv.pdf';

update public.projects as p
set role = v.role, period = v.period, highlight = v.highlight
from (
  values
    (
      'Nectar',
      'Senior Mobile Developer · JubileeMedia',
      'Jun 2024 – present',
      'Built and shipped the app that reached 120K monthly active users within 5 months of launch, with 60% D1, 40% D7 and 20% D30 retention'
    ),
    (
      'AQ Shop',
      'React Native Engineer · ArcadeQuest',
      'Dec 2022 – May 2024',
      null
    ),
    (
      'ArcadeQuest',
      'React Native Engineer · ArcadeQuest',
      'Dec 2022 – May 2024',
      'Shipped a new onboarding flow that significantly improved retention and conversion'
    ),
    (
      'Twig',
      'Mobile Developer · Twig, London',
      'Nov 2020 – Dec 2022',
      'Built features for an app with 1M+ installs'
    ),
    (
      'Mobile Portfolio',
      'Personal project',
      '2026',
      'Every pull request gated by type checks, lint, tests, dead-code detection and CodeQL'
    )
) as v (title, role, period, highlight)
where p.title = v.title;
