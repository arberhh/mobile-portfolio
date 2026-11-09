-- Add the multimodal RAG app, a personal side project for trying out
-- retrieval-augmented generation, not a product. The repo is public, so it
-- links to GitHub.
--
-- banner_url and images are screenshots of the iOS app, uploaded to
-- the `portofolio/multimodal-rag/` storage path before this migration merges.

-- Resync the id sequence before inserting, same precaution as the earlier
-- project migrations.
select setval(pg_get_serial_sequence('public.projects', 'id'), (select max(id) from public.projects));

with new_project as (
  insert into public.projects (
    title,
    slug,
    role,
    period,
    highlight,
    short_description,
    long_description,
    personal,
    github,
    banner_url,
    banner_alt,
    images,
    tools_technologies,
    non_technical_contributions,
    techical_contributions
  )
  values (
    'Multimodal RAG',
    'multimodal-rag',
    'Side project',
    'Oct 2026 – present',
    'Answers questions about PDFs, Word files and Google Docs, charts and tables included, and names the page each answer came from',
    'A side project for trying out retrieval-augmented generation: add PDFs, Word files or Google Docs, ask questions in your own words, and get answers that cite the pages they came from. A React Native app for iOS, Android and web over a Fastify API with Postgres, pgvector, Claude and Voyage.',
    'A side project where I try out retrieval-augmented generation end to end. You add PDFs, Word files or Google Docs and ask questions in your own words. Claude reads every page, tables, charts and pictures included, and each answer names the pages it used, so you can check it. It''s a pnpm monorepo: a React Native app for iOS, Android and web built with One, and a Fastify API over Postgres with pgvector.',
    true,
    'https://github.com/arberhh/multimodal-rag',
    'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-banner.png',
    'Three iPhone screens: the home screen, an answer citing product-launch.pdf page 2, and the documents list',
    array[
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-home.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-documents.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-answer.png',
      'https://yqxldkqfpjnkmjcjuvgb.supabase.co/storage/v1/object/public/portofolio/multimodal-rag/ios-chats.png'
    ],
    array[
      'App: React Native, One, TypeScript, Reanimated',
      'API: Node.js, Fastify, zod',
      'Data: Postgres with pgvector, Postgrator migrations',
      'AI: Claude Haiku to read pages, Claude Sonnet to answer, Voyage embeddings',
      'Tooling: pnpm workspaces, Docker Compose, LibreOffice, Postman'
    ],
    array[
      'Built it to learn how retrieval works end to end, from reading a page to citing it in an answer.'
    ],
    array[
      'Built document ingestion: Word files go through LibreOffice and Google Docs are fetched as PDFs, then Claude Haiku writes out each page, tables and chart values included, in the background.',
      'Embedded each page with Voyage and stored it in Postgres with pgvector, so a question finds the five pages closest in meaning.',
      'Streamed Claude Sonnet''s answers to the app with citations, and showed the part of the page each source used.',
      'Gave each install its own anonymous user through a device id kept in the iOS keychain or Android keystore, and scoped documents and chats to it.',
      'Shared the API types between the server and the app.'
    ]
  )
  returning id
)
insert into public.project_domains (project_id, domain_id)
select new_project.id, d.id
from new_project
cross join public.domains d
where d.title in ('ai', 'data');
