import { Easing } from "react-native-reanimated";
import { darkTheme, lightTheme } from "@/themes";

// Motion tokens (DESIGN §5).
export const DURATION = { press: 120, hover: 200, enter: 280, theme: 240 } as const;
export const STAGGER = 50;
export const MAX_STAGGER_ITEMS = 5;
export const CARET_PERIOD = 1060;
export const EASE_STANDARD = Easing.bezier(0.2, 0, 0, 1);
export const SPRING_PRESS = { damping: 18, stiffness: 260 };

const EASE_CSS = "cubic-bezier(0.2, 0, 0, 1)";

// Web motion is CSS on data-* attributes, so the static HTML and the first
// client render are identical and nothing waits on JS. Injected by
// app/+html.tsx.
export const WEB_MOTION_CSS = `
@keyframes enter {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
}
[data-enter] {
  animation: enter ${DURATION.enter}ms ${EASE_CSS} both;
  animation-delay: calc(min(var(--i, 0), ${MAX_STAGGER_ITEMS}) * ${STAGGER}ms);
}
/* A light-OS visitor's page is hidden until the theme matches; hold the
   entrance until then so it plays in full once visible. */
html[data-theme-pending] [data-enter] { animation-play-state: paused; }
${Array.from({ length: MAX_STAGGER_ITEMS }, (_, i) => `[data-enter="${i + 1}"] { --i: ${i + 1}; }`).join("\n")}

@keyframes blink { 50% { opacity: 0; } }
[data-caret] {
  display: inline-block;
  width: 10px;
  height: 20px;
  margin-left: 6px;
  border-radius: 1px;
  background-color: ${lightTheme.accent};
  animation: blink ${CARET_PERIOD}ms steps(1) infinite;
}
[data-caret="small"] { width: 8px; height: 16px; margin-left: 4px; }
/* Scales with the text it follows (the 72px 404): 0.55em wide, cap height. */
[data-caret="display"] { width: 0.55em; height: 0.7em; margin-left: 0.08em; border-radius: 2px; }
[data-sky] [data-caret] { background-color: ${lightTheme.text}; }

/* Only after the launch theme sync (data-theme-ready), so loading never animates. */
html[data-theme-ready] [data-shell-root],
html[data-theme-ready] [data-shell-content],
html[data-theme-ready] [data-window] {
  transition: background-color ${DURATION.theme}ms ${EASE_CSS}, color ${DURATION.theme}ms ${EASE_CSS};
}
html[data-theme-ready] [data-contact] {
  transition: background-color ${DURATION.hover}ms ${EASE_CSS}, filter ${DURATION.hover}ms ${EASE_CSS};
}

/* RN web text is pre-wrap, which keeps (and underlines) the space where a
   link wraps; normal lets it hang without the underline. */
[data-inline-link] { text-underline-offset: 3px; white-space: normal; }

@media (hover: hover) and (pointer: fine) {
  [data-contact="primary"]:hover { filter: brightness(1.06); }
  [data-contact="secondary"][data-contact-theme="light"]:hover { background-color: ${lightTheme.surfaceRaised} !important; }
  [data-contact="secondary"][data-contact-theme="dark"]:hover { background-color: ${darkTheme.surfaceRaised} !important; }
  [data-inline-link]:hover { text-decoration-thickness: 2px; text-decoration-color: ${lightTheme.accent} !important; }
}

@media (prefers-reduced-motion: reduce) {
  [data-enter], [data-caret], [data-card], [data-card] *, [data-contact],
  [data-nav-pill], [data-icon-button],
  [data-shell-root], [data-shell-content], [data-window] {
    animation: none !important;
    transition: none !important;
  }
  /* expo-image's fade-in. */
  [data-shell-root] img { transition: none !important; }
}
`;
