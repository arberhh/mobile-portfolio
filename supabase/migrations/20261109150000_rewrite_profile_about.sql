-- Rewrite the profile's about text as a short CV summary. `[label](url)`
-- renders as a link, so Dosvita and the RAG repo stay linked.

update public.profile
set about_me = 'Senior Software Engineer with 7+ years building mobile apps and the backends behind them, 5+ in React Native. At JubileeMedia, I build Nectar, a dating app that reached 120K monthly active users within five months of launch. Previously shipped React Native and Node.js products at ArcadeQuest and Twig (1M+ installs). Independently built [Dosvita](https://dosvita.app), a live web app that turns a CV into a portfolio using the Claude API, and a [multimodal RAG app](https://github.com/arberhh/multimodal-rag) for chatting with docs.'
where id = 1;
