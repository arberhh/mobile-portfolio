import React from "react";
import Head from "expo-router/head";
import { SITE_DESCRIPTION, SITE_IMAGE, SITE_NAME, SITE_URL } from "@/constants";

interface PageHeadProps {
  // Page-specific part of the title; omitted on Home, which uses the site name.
  title?: string;
  description?: string;
  // Route path without the base URL, e.g. "/project/nectar".
  path: string;
  image?: string;
  // For pages that shouldn't be indexed or canonicalised (the 404 page).
  noIndex?: boolean;
}

// Per-route <title>, canonical and Open Graph tags, baked into each page's
// static HTML so shared links preview the right project. No-op on native.
function PageHead({
  title,
  description = SITE_DESCRIPTION,
  path,
  image,
  noIndex = false,
}: PageHeadProps) {
  const fullTitle = title ? `${title} · Arber Haxhimusa` : SITE_NAME;
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const ogImage = image || SITE_IMAGE;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}

export default PageHead;
