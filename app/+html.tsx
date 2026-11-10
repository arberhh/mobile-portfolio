import React from "react";
import { ScrollViewStyleReset } from "expo-router/html";
import { Props } from "@/types";
import { WEB_SHELL_CSS } from "@/constants";
import { WEB_MOTION_CSS } from "@/constants/motion";
import { PROJECT_CARD_CSS } from "@/components/project/web-styles";
import { darkTheme, lightTheme } from "@/themes";

const GA_ID = "G-YV3EEXM80T";

const gaSnippet = `
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("js", new Date());
gtag("config", "${GA_ID}");
`;

// Runs before first paint: the static HTML is dark, so for a light-OS visitor
// the page paints light and the shell stays hidden (WEB_SHELL_CSS) until
// useSystemThemeSync switches the theme and removes the attribute. The timeout
// clears it anyway if the bundle never runs, which also unpauses the entrance.
const themePendingSnippet = `
if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  document.documentElement.setAttribute("data-theme-pending", "");
  setTimeout(function () { document.documentElement.removeAttribute("data-theme-pending"); }, 1500);
}
`;

// Root HTML for every statically rendered page (web only). Page-specific
// <title>, description, canonical and Open Graph tags come from <PageHead>
// in each screen, so only site-wide tags live here.
export default function Root({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <script dangerouslySetInnerHTML={{ __html: themePendingSnippet }} />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "html[data-theme-pending] [data-shell-root] { visibility: visible !important; }",
            }}
          />
        </noscript>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content={lightTheme.sky} media="(prefers-color-scheme: light)" />
        <meta
          name="theme-color"
          content={darkTheme.screenBackground}
          media="(prefers-color-scheme: dark)"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Arber Haxhimusa" />
        <meta name="twitter:card" content="summary_large_image" />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: gaSnippet }} />
        {/* Disables body scrolling so ScrollView behaves like it does on native. */}
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{ __html: WEB_SHELL_CSS + PROJECT_CARD_CSS + WEB_MOTION_CSS }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
