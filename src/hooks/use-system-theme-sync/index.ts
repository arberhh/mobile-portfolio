import { useEffect, useRef } from "react";
import { Appearance } from "react-native";
import { useTheme } from "@/context";
import showTheme from "./show-theme";

// Called once from app/_layout, so it runs on whichever route opens first.
function useSystemThemeSync() {
  const { theme, toggleTheme } = useTheme();
  const checkedOnLaunch = useRef(false);
  const shown = useRef(false);

  // The first render is always dark (static web HTML has no OS to ask), so
  // match the OS once after mount, then show the page once the theme
  // matches. Only once: later, a manual toggle wins until the OS changes.
  useEffect(() => {
    if (shown.current) return;
    const scheme = Appearance.getColorScheme();
    const mismatch = (scheme === "light" || scheme === "dark") && scheme !== theme.theme;
    if (mismatch && !checkedOnLaunch.current) {
      checkedOnLaunch.current = true;
      toggleTheme();
      return;
    }
    // Shown even if still mismatched, so the page can never stay hidden.
    shown.current = true;
    showTheme();
  }, [theme.theme, toggleTheme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme !== theme.theme) {
        toggleTheme();
      }
    });
    return () => subscription.remove();
  }, [theme.theme, toggleTheme]);
}

export default useSystemThemeSync;
