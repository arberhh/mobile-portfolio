import React from "react";
import { View } from "react-native";
import { useTheme } from "@/context";
import { cardElevation } from "@/themes";
import { Props } from "@/types";
import ThemeText from "../theme-text";
import styles from "./styles";

interface TerminalWindowProps extends Props {
  title: string;
  // A dark-scoped window on a light page: the caller knows the page theme.
  raised?: boolean;
}

// A window with a title bar: the frame for the hero, profile card, slideshow
// and 404. The body inset comes from `data-inset` on web (WEB_SHELL_CSS).
function TerminalWindow({ title, raised = false, children }: TerminalWindowProps) {
  const { theme } = useTheme();
  const isLight = theme.theme === "light";
  // Decorative and never pink: one bright dot, two dim ones.
  const brightDot = { backgroundColor: isLight ? theme.cardBackground : theme.sky };
  const dimDot = { backgroundColor: theme.dotInactive };

  return (
    <View
      dataSet={{ window: "" }}
      style={[
        styles.container,
        { backgroundColor: theme.cardBackground },
        cardElevation[theme.theme],
        raised && styles.raised,
      ]}
    >
      {/* `data-sky` switches the focus ring to navy on the sky title bar. */}
      <View
        dataSet={isLight ? { sky: "" } : undefined}
        style={[styles.titleBar, { backgroundColor: theme.titleBar }]}
      >
        <View
          style={styles.dots}
          aria-hidden
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <View style={[styles.dot, brightDot]} />
          <View style={[styles.dot, dimDot]} />
          <View style={[styles.dot, dimDot]} />
        </View>
        <ThemeText style={styles.title} text={title} numberOfLines={1} />
        <View style={styles.dots} />
      </View>
      <View dataSet={{ inset: "" }} style={styles.body}>
        {children}
      </View>
    </View>
  );
}

export default TerminalWindow;
