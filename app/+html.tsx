import React from "react";
import { ScrollViewStyleReset } from "expo-router/html";
import { Props } from "@/types";
import { WEB_SHELL_CSS } from "@/constants";

const GA_ID = "G-YV3EEXM80T";

const gaSnippet = `
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("js", new Date());
gtag("config", "${GA_ID}");
`;

// Root HTML for every statically rendered page (web only). Page-specific
// <title>, description, canonical and Open Graph tags come from <PageHead>
// in each screen, so only site-wide tags live here.
export default function Root({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#0B0D0C" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Arber Haxhimusa" />
        <meta name="twitter:card" content="summary_large_image" />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: gaSnippet }} />
        {/* Disables body scrolling so ScrollView behaves like it does on native. */}
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: WEB_SHELL_CSS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
