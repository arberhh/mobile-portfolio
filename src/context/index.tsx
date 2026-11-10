import React, { useReducer, useContext, createContext } from "react";
import { Theme, lightTheme, darkTheme } from "@/themes";
import { Props } from "@/types";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

type Action = { type: "TOGGLE_THEME" };

const ThemeContext = createContext<ThemeState | undefined>(undefined);

const darkState: ThemeState = {
  theme: darkTheme,
  toggleTheme: () => {},
};

function themeReducer(state: ThemeState, action: Action): ThemeState {
  switch (action.type) {
    case "TOGGLE_THEME":
      return {
        ...state,
        theme: state.theme === lightTheme ? darkTheme : lightTheme,
      };
    default:
      return state;
  }
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function ThemeProvider({ children }: Props) {
  const [state, dispatch] = useReducer(themeReducer, darkState);

  function toggleTheme() {
    dispatch({ type: "TOGGLE_THEME" });
  }
  return (
    <ThemeContext.Provider value={{ theme: state.theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

interface ThemeScopeProps extends Props {
  theme: Theme;
}

// Re-provides fixed tokens to a subtree (e.g. the always-navy hero window)
// while the toggle still flips the app theme.
function ThemeScope({ theme, children }: ThemeScopeProps) {
  const { toggleTheme } = useTheme();
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export { ThemeProvider, ThemeScope, useTheme, themeReducer, darkState };
