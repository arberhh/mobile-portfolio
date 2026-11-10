import { ViewStyle } from "react-native";

export interface Theme {
  theme: "light" | "dark";
  screenBackground: string; // page and window body
  color: string; // icons, back chevron, prompt path text, section heading titles
  text: string; // primary text
  textSecondary: string; // body copy, meta
  accent: string; // pink graphics: caret, fills, bars, active dot
  cardBackground: string; // cards, window bodies
  line: string; // hairlines
  chipBorder: string; // outline buttons and chips
  dotInactive: string; // inactive carousel dot
  accentText: string; // small pink text that still passes AA
  onAccent: string; // text/icon on a pink fill
  sky: string;
  desktop: string; // web ≥900 page behind the window
  heroBandStart: string;
  heroBandEnd: string;
  titleBar: string;
  surfaceRaised: string; // chips, icon-button fill, banner frame
  highlightBackground: string; // metric callout tint
  focusRing: string;
  shadow: string;
}

export const lightTheme: Theme = {
  theme: "light",
  screenBackground: "#F5F9FC",
  color: "#0B2545",
  text: "#0B2545",
  textSecondary: "#3D5672",
  accent: "#D81B72",
  cardBackground: "#FFFFFF",
  line: "rgba(11,37,69,0.10)",
  chipBorder: "rgba(11,37,69,0.18)",
  dotInactive: "rgba(11,37,69,0.25)",
  accentText: "#B3195F",
  onAccent: "#FFFFFF",
  sky: "#CFE3F1",
  desktop: "#CFE3F1",
  heroBandStart: "#CFE3F1",
  heroBandEnd: "#F5F9FC",
  titleBar: "#CFE3F1",
  surfaceRaised: "#E9F1F7",
  highlightBackground: "#FBEAF2",
  focusRing: "#D81B72",
  shadow: "#0B2545",
};

export const darkTheme: Theme = {
  theme: "dark",
  screenBackground: "#071A31",
  color: "#9CCBE6",
  text: "#F3F7FA",
  textSecondary: "#B7CCDD",
  accent: "#FF4D94",
  cardBackground: "#0C2442",
  line: "rgba(156,203,230,0.14)",
  chipBorder: "rgba(156,203,230,0.28)",
  dotInactive: "rgba(156,203,230,0.30)",
  accentText: "#FF7AAE",
  onAccent: "#1A0610",
  sky: "#9CCBE6",
  desktop: "#040D1A",
  heroBandStart: "#0C2442",
  heroBandEnd: "#071A31",
  titleBar: "#12305A",
  surfaceRaised: "#12305A",
  highlightBackground: "#2E2147",
  focusRing: "#FF4D94",
  shadow: "#000000",
};

// 4 pt scale (DESIGN §3).
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 56,
  "6xl": 72,
} as const;

// Window and card body inset. Native uses this fixed value; on web
// WEB_SHELL_CSS raises it on `data-inset` (20 at ≥400, 24 at ≥900).
export const INSET = 16;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 24,
  pill: 999,
} as const;

// `card` elevation (DESIGN §3): a soft navy shadow in light, a hairline only
// in dark, where a shadow wouldn't show on navy.
export const cardElevation: Record<Theme["theme"], ViewStyle> = {
  light: {
    borderColor: "rgba(11,37,69,0.08)",
    borderWidth: 1,
    boxShadow: "0 8px 24px rgba(11,37,69,0.08)",
  },
  dark: {
    borderColor: darkTheme.line,
    borderWidth: 1,
  },
};
