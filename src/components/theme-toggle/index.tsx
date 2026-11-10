import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/context";
import { DURATION, EASE_STANDARD } from "@/constants/motion";
import { radius } from "@/themes";
import Icon from "../icon";

const ICON_SIZE = 22;

// Sun (shown in dark) and moon (shown in light) are stacked; one value runs
// 0 → 1 as the theme goes light → dark, turning the pair 180° while they
// crossfade. Only a press animates: the launch sync to the OS theme and later
// OS switches snap, so nothing spins on load.
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme.theme === "dark";
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(isDark ? 1 : 0);
  const fromPress = useRef(false);

  useEffect(() => {
    const target = isDark ? 1 : 0;
    const animate = fromPress.current && !reduceMotion;
    fromPress.current = false;
    progress.set(
      animate ? withTiming(target, { duration: DURATION.theme, easing: EASE_STANDARD }) : target,
    );
  }, [isDark, progress, reduceMotion]);

  function onPress() {
    fromPress.current = true;
    toggleTheme();
  }

  const spin = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` }],
  }));
  const sun = useAnimatedStyle(() => ({ opacity: progress.value }));
  const moon = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));

  return (
    <Pressable
      dataSet={{ iconButton: "" }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Switch to light theme" : "Switch to dark theme"}
      style={({ pressed }) => [styles.button, pressed && { backgroundColor: theme.surfaceRaised }]}
    >
      <Animated.View style={[styles.icons, spin]}>
        <Animated.View style={[StyleSheet.absoluteFill, sun]}>
          <Icon name="sunny" size={ICON_SIZE} color={theme.color} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, moon]}>
          <Icon name="moon" size={ICON_SIZE} color={theme.color} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  icons: { height: ICON_SIZE, width: ICON_SIZE },
});

export default ThemeToggle;
