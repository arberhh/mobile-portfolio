// The fonts are @font-face rules in app/+html.tsx (WEB_FONT_CSS), and web
// never waits for them, so there's nothing to load here.
export default function useAppFonts() {
  return true;
}
