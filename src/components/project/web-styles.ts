import { DURATION } from "@/constants/motion";
import { darkTheme } from "@/themes";

const EASE = `${DURATION.hover}ms cubic-bezier(0.2, 0, 0, 1)`;

// Web CSS for B's components, injected by app/+html.tsx.
// Cards (DESIGN §3, §5): `data-card` carries the theme name so dark mode can
// swap the lifted shadow for a sky border. Hover only applies to real
// pointers, so touch screens don't keep a lifted card after a tap.
// !important beats react-native-web's atomic classes and the icon's inline
// colour.
// Tool rows (DESIGN §6.9): the label moves into a 140px column at ≥768.
// Slideshow: below 600px the slide area is a square instead of 360 tall.
// Most screenshots are portrait phone shots (≈0.46), a few are 16:10; a
// square keeps phone shots readable and the landscape bands moderate.
export const PROJECT_CARD_CSS = `
[data-card] { transition: transform ${EASE}, box-shadow ${EASE}, border-color ${EASE}; }
[data-card-arrow], [data-card-arrow] * { transition: transform ${EASE}, color ${EASE}; }
@media (hover: hover) and (pointer: fine) {
  [data-card]:hover { transform: translateY(-4px) !important; }
  [data-card="light"]:hover {
    box-shadow: 0 2px 4px rgba(11,37,69,.06), 0 16px 40px rgba(11,37,69,.16) !important;
  }
  [data-card="dark"]:hover { border-color: rgba(156,203,230,0.45) !important; }
  [data-card]:hover [data-card-arrow] { transform: translateX(4px); }
  [data-card]:hover [data-card-arrow] * { color: ${darkTheme.accent} !important; }
}
[data-card]:active { transform: scale(0.98) !important; }

@media (max-width: 599px) {
  [data-slide-area] { height: auto !important; aspect-ratio: 1 / 1; }
}
@media (min-width: 768px) {
  [data-tool-row] { flex-direction: row !important; gap: 16px !important; }
  /* 208px fits every current label on one line. The top offset puts the
     label's first baseline on the 26px value line's first baseline. */
  [data-tool-label] { flex: 0 0 208px; padding-top: 7px !important; }
}
`;
