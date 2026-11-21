import React, { useLayoutEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/context";
import { DURATION, EASE_CSS } from "@/constants/motion";
import { animate } from "@/util/web-animate";
import Icon from "../icon";
import styles, { ICON_SIZE } from "./styles";

// Same as index.tsx without Reanimated: the pair turns 180° and crossfades,
// and only a press animates, so the launch sync and OS switches snap.
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme.theme === "dark";
  const sunOpacity = isDark ? 1 : 0;
  const fromPress = useRef(false);
  const icons = useRef<View>(null);
  const sun = useRef<View>(null);
  const moon = useRef<View>(null);

  // Before paint, so the new end state never shows un-animated first.
  useLayoutEffect(() => {
    if (!fromPress.current) return;
    fromPress.current = false;
    const options = { duration: DURATION.theme, easing: EASE_CSS };
    const [from, to] = isDark ? [0, 1] : [1, 0];
    animate(
      icons.current,
      [{ transform: `rotate(${from * 180}deg)` }, { transform: `rotate(${to * 180}deg)` }],
      options,
    );
    animate(sun.current, [{ opacity: from }, { opacity: to }], options);
    animate(moon.current, [{ opacity: 1 - from }, { opacity: 1 - to }], options);
  }, [isDark]);

  function onPress() {
    fromPress.current = true;
    toggleTheme();
  }

  return (
    <Pressable
      dataSet={{ iconButton: "" }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Switch to light theme" : "Switch to dark theme"}
      style={({ pressed }) => [styles.button, pressed && { backgroundColor: theme.surfaceRaised }]}
    >
      <View
        ref={icons}
        style={[styles.icons, { transform: [{ rotate: isDark ? "180deg" : "0deg" }] }]}
      >
        <View ref={sun} style={[StyleSheet.absoluteFill, { opacity: sunOpacity }]}>
          <Icon name="sunny" size={ICON_SIZE} color={theme.color} />
        </View>
        <View ref={moon} style={[StyleSheet.absoluteFill, { opacity: 1 - sunOpacity }]}>
          <Icon name="moon" size={ICON_SIZE} color={theme.color} />
        </View>
      </View>
    </Pressable>
  );
}

export default ThemeToggle;
