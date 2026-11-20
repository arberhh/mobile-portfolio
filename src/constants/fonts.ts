import { SITE_URL } from "./links";

// IBMPlexMono_600SemiBold and _700Bold register without error via expo-font
// but iOS silently refuses to render them as the custom font (falls back to
// the system font) — a CoreText/RCTFont quirk, not a loading failure. Only
// mono 400/500 are used. The weight comes from the family name, so never
// pair these with `fontWeight`.
export const FONT_REGULAR = "IBMPlexMono_400Regular";
export const FONT_MEDIUM = "IBMPlexMono_500Medium";

export const FONT_SANS_REGULAR = "IBMPlexSans_400Regular";
export const FONT_SANS_MEDIUM = "IBMPlexSans_500Medium";
export const FONT_SANS_SEMIBOLD = "IBMPlexSans_600SemiBold";

// Web serves these families as Latin-subset WOFF2 files from public/fonts
// (IBM Plex via @fontsource, OFL) instead of expo-font's TTFs: about 100 KB
// instead of about 920 KB. Same family names, so styles don't change.
// Injected and preloaded by app/+html.tsx.
const FONT_PATH = `${new URL(SITE_URL).pathname}/fonts`;
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

export const WEB_FONT_FILES = [
  [FONT_SANS_REGULAR, "ibm-plex-sans-latin-400-normal.woff2"],
  [FONT_SANS_MEDIUM, "ibm-plex-sans-latin-500-normal.woff2"],
  [FONT_SANS_SEMIBOLD, "ibm-plex-sans-latin-600-normal.woff2"],
  [FONT_REGULAR, "ibm-plex-mono-latin-400-normal.woff2"],
  [FONT_MEDIUM, "ibm-plex-mono-latin-500-normal.woff2"],
].map(([family, file]) => ({ family, url: `${FONT_PATH}/${file}` }));

export const WEB_FONT_CSS = WEB_FONT_FILES.map(
  ({ family, url }) =>
    `@font-face { font-family: "${family}"; src: url(${url}) format("woff2"); font-display: swap; unicode-range: ${LATIN}; }`,
).join("\n");
