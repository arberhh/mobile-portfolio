import React, { ReactNode, useEffect } from "react";
import { act, renderHook } from "@testing-library/react-native";
import { lightTheme, darkTheme } from "@/themes";
import { ThemeProvider, ThemeScope, themeReducer, darkState, useTheme } from "./index";

describe("themeReducer", () => {
  it("flips from dark to light on TOGGLE_THEME", () => {
    const state = { theme: darkTheme, toggleTheme: () => {} };

    const next = themeReducer(state, { type: "TOGGLE_THEME" });

    expect(next.theme).toBe(lightTheme);
  });

  it("flips from light to dark on TOGGLE_THEME", () => {
    const state = { theme: lightTheme, toggleTheme: () => {} };

    const next = themeReducer(state, { type: "TOGGLE_THEME" });

    expect(next.theme).toBe(darkTheme);
  });

  it("preserves the rest of the state on TOGGLE_THEME", () => {
    const toggleTheme = () => {};
    const state = { theme: darkTheme, toggleTheme };

    const next = themeReducer(state, { type: "TOGGLE_THEME" });

    expect(next.toggleTheme).toBe(toggleTheme);
  });

  it("starts from dark theme by default", () => {
    expect(darkState.theme).toBe(darkTheme);
  });

  it("is a no-op for an unknown action", () => {
    const state = { theme: lightTheme, toggleTheme: () => {} };

    // @ts-expect-error - deliberately passing an action outside the known union
    const next = themeReducer(state, { type: "UNKNOWN" });

    expect(next).toBe(state);
  });
});

describe("ThemeScope", () => {
  it("keeps its own tokens under a light provider and passes the toggle up", () => {
    const appThemes: string[] = [];
    function AppTheme({ children }: { children: ReactNode }) {
      const { theme } = useTheme();
      useEffect(() => {
        appThemes.push(theme.theme);
      }, [theme.theme]);
      return <ThemeScope theme={darkTheme}>{children}</ThemeScope>;
    }
    function wrapper({ children }: { children: ReactNode }) {
      return (
        <ThemeProvider>
          <AppTheme>{children}</AppTheme>
        </ThemeProvider>
      );
    }

    const { result } = renderHook(() => useTheme(), { wrapper });
    // The provider starts dark; the scoped toggle flips the app to light.
    act(() => result.current.toggleTheme());

    expect(appThemes.at(-1)).toBe("light");
    expect(result.current.theme.theme).toBe("dark");
  });
});
