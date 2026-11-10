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
