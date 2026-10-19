const WEB_WIDE_BREAKPOINT = 900;
const WEB_CONTENT_WIDTH = 600;
const WEB_SIDEBAR_WIDTH = 220;

// The wide-web sidebar layout is switched on by a media query instead of
// useWindowDimensions: static HTML is rendered with no window, so a
// JS-measured layout would never match the server markup on hydration.
// Targets the `data-shell-*` attributes set in web-app-shell/index.web.tsx;
// !important beats react-native-web's atomic classes.
export const WEB_SHELL_CSS = `
[data-shell-sidebar] { display: none !important; }
@media (min-width: ${WEB_WIDE_BREAKPOINT}px) {
  [data-shell-sidebar] { display: flex !important; width: ${WEB_SIDEBAR_WIDTH}px !important; }
  [data-shell-content] {
    flex: 0 0 ${WEB_CONTENT_WIDTH}px !important;
    border-left-width: 1px !important;
    border-right-width: 1px !important;
  }
}
`;
