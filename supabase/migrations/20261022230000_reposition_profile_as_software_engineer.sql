-- Present the profile as a software engineer across mobile, web and back
-- end rather than a mobile one. Project roles stay as they are, since
-- they're the actual job titles held at each company.
--
-- Home shows `intro` and Profile now shows `about_me`, so the two no longer
-- repeat each other: `intro` is the short pitch, `about_me` the story, and
-- neither restates `main_techs`, which Profile lists right below.
-- `[label](url)` in about_me renders as an inline link (LinkedText).

update public.profile
set
  headline = 'Senior Software Engineer',
  intro = 'Software engineer with 7+ years of shipping production products across mobile, web and back end, including 5+ years of React Native. I take features from architecture and development through testing, CI/CD and release.',
  about_me = 'I currently build Nectar, a dating app at JubileeMedia that reached 120K monthly active users within five months of launch. Before that I developed React Native apps and the Node.js services behind them at ArcadeQuest, and worked on Twig, an app with more than 1 million installs. On my own I built [Dosvita](https://dosvita.app), a live web app that turns a CV into a portfolio with the Claude API, and I try out new ideas in side projects like a [multimodal RAG app](https://github.com/arberhh/multimodal-rag) for chatting with PDFs. Along the way I have led architecture decisions and mentored engineers.',
  main_techs = array['TypeScript', 'React', 'React Native', 'Expo', 'Node.js', 'GraphQL', 'Supabase', 'PostgreSQL', 'Claude API'];
