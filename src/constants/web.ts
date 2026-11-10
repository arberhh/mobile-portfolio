import { INSET, darkTheme, lightTheme, radius, space } from "@/themes";

const WEB_WIDE_BREAKPOINT = 900;
const WEB_CONTENT_WIDTH = 720;
const WEB_SIDEBAR_WIDTH = 240;

// The wide-web layout is switched on by media queries instead of
// useWindowDimensions: static HTML is rendered with no window, so a
// JS-measured layout would never match the server markup on hydration.
// Targets the `data-*` attributes set through `dataSet` (web-app-shell,
// terminal-window, intro, the screens); !important beats react-native-web's
// atomic classes. `data-shell-theme` on the root picks the per-theme rules.
const EASE = "cubic-bezier(0.2, 0, 0, 1)";
// "Graph paper" dots on the sky (SPEC-54): decorative, never behind body text.
const dots = (color: string) =>
  `background-image: radial-gradient(circle, ${color} 1px, transparent 1.6px); background-size: 20px 20px;`;
const DOTS_LIGHT = dots("rgba(11, 37, 69, 0.16)");
const DOTS_DARK = dots("rgba(156, 203, 230, 0.10)");
// At most ~72 characters per line of Plex Sans 16 (measured on Home,
// Profile and the detail pages). `ch` is the width of "0", wider than the
// average letter, so 68ch gave 85-92.
const MEASURE = "500px";

export const WEB_SHELL_CSS = `
html, body { background-color: ${darkTheme.screenBackground}; }
html:has([data-shell-theme="light"]), html:has([data-shell-theme="light"]) body {
  background-color: ${lightTheme.screenBackground};
}
[data-shell-root] { min-height: 100%; }
[data-shell-sidebar] { display: none !important; }

/* The static HTML is dark. For a light-OS visitor the pre-paint script in
   +html.tsx sets data-theme-pending: the page paints light and the dark shell
   stays hidden until useSystemThemeSync switches the theme and removes it.
   The delayed reveal is a fail-safe. */
@keyframes reveal { to { visibility: visible; } }
html[data-theme-pending], html[data-theme-pending] body {
  background-color: ${lightTheme.screenBackground};
}
/* !important and the higher specificity keep the fail-safe alive under the
   reduced-motion reset in WEB_MOTION_CSS (it has no motion, only a delay). */
html[data-theme-pending] [data-shell-root] {
  visibility: hidden;
  animation: reveal 0s 1500ms forwards !important;
}

/* One inset for window and card bodies (DESIGN §3); native keeps INSET. */
[data-inset] { padding-left: ${INSET}px !important; padding-right: ${INSET}px !important; }
/* Below 900 the dots sit on the hero band and fade out with it. */
[data-hero-band]::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  mask-image: linear-gradient(#000 0%, transparent 85%);
  -webkit-mask-image: linear-gradient(#000 0%, transparent 85%);
}
[data-shell-theme="light"] [data-hero-band]::after { ${DOTS_LIGHT} }
[data-shell-theme="dark"] [data-hero-band]::after { ${DOTS_DARK} }

@media (min-width: 400px) {
  [data-inset] { padding-left: ${space.xl}px !important; padding-right: ${space.xl}px !important; }
}
@media (min-width: 768px) {
  [data-measure] { max-width: ${MEASURE}; }
}

:focus-visible {
  outline: 2px solid var(--focus, ${lightTheme.focusRing}) !important;
  outline-offset: 2px;
}
[data-sky] { --focus: ${lightTheme.text}; }

/* Only after the launch theme sync, so the swap itself never fades. */
html[data-theme-ready] [data-nav-pill],
html[data-theme-ready] [data-icon-button] { transition: background-color 200ms ${EASE}; }
@media (hover: hover) and (pointer: fine) {
  [data-shell-theme="light"] [data-nav-pill]:not([data-active]):hover {
    background-color: rgba(255, 255, 255, 0.45) !important;
  }
  [data-shell-theme="dark"] [data-nav-pill]:not([data-active]):hover {
    background-color: rgba(156, 203, 230, 0.10) !important;
  }
  [data-shell-theme="light"] [data-icon-button]:hover { background-color: ${lightTheme.surfaceRaised} !important; }
  [data-shell-theme="dark"] [data-icon-button]:hover { background-color: ${darkTheme.surfaceRaised} !important; }
}

@media (min-width: ${WEB_WIDE_BREAKPOINT}px) {
  /* Dark first: while pending, the static HTML is still dark, so the light
     rules (same specificity) must come later to win. */
  html:has([data-shell-theme="dark"]), html:has([data-shell-theme="dark"]) body {
    background-color: ${darkTheme.desktop};
    ${DOTS_DARK}
  }
  html:has([data-shell-theme="light"]), html:has([data-shell-theme="light"]) body,
  html[data-theme-pending], html[data-theme-pending] body {
    background-color: ${lightTheme.desktop};
  }
  html:has([data-shell-theme="light"]) body, html[data-theme-pending] body { ${DOTS_LIGHT} }
  /* The root is see-through here so the body's dotted desktop shows. */
  [data-shell-root] { background-color: transparent !important; }
  [data-shell-root] { align-items: flex-start !important; }
  [data-shell-sidebar] {
    display: flex !important;
    width: ${WEB_SIDEBAR_WIDTH}px !important;
    margin-right: ${space["3xl"]}px !important;
    padding-top: ${space["2xl"]}px !important;
  }
  [data-shell-content] {
    flex: 0 0 ${WEB_CONTENT_WIDTH}px !important;
    max-width: ${WEB_CONTENT_WIDTH}px;
    height: calc(100vh - ${space["2xl"] * 2}px) !important;
    margin: ${space["2xl"]}px 0 !important;
    border-radius: ${radius.xl}px !important;
    overflow: hidden !important;
  }
  [data-shell-theme="light"] [data-shell-content] { box-shadow: 0 24px 64px rgba(11, 37, 69, 0.22); }
  [data-shell-theme="dark"] [data-shell-content] {
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);
    border: 1px solid ${darkTheme.line} !important;
  }
  [data-gutter] {
    padding-left: ${space["3xl"]}px !important;
    padding-right: ${space["3xl"]}px !important;
  }
  [data-hero-band] { display: none !important; }
  [data-shell-theme="light"] [data-header-bar] { background-color: ${lightTheme.screenBackground} !important; }
  [data-shell-theme="dark"] [data-header-bar] { background-color: ${darkTheme.screenBackground} !important; }
  [data-inset] { padding-left: ${space["2xl"]}px !important; padding-right: ${space["2xl"]}px !important; }
  [data-display] { font-size: 44px !important; line-height: 50px !important; letter-spacing: -1.2px !important; }
}
`;
