import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/context";
import { CARET_PERIOD } from "@/constants/motion";

interface CaretProps {
  size?: "hero" | "small" | "display";
}

const HALF = CARET_PERIOD / 2;

// Hard on/off like a terminal cursor, not a fade; solid with reduced motion.
function Caret({ size = "hero" }: CaretProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      opacity.set(1);
      return;
    }
    opacity.set(
      withRepeat(
        withSequence(
          withDelay(HALF, withTiming(0, { duration: 0 })),
          withDelay(HALF, withTiming(1, { duration: 0 })),
        ),
        -1,
      ),
    );
  }, [opacity, reduceMotion]);

  const blink = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[SIZES[size], { backgroundColor: theme.accent }, blink]}
    />
  );
}

const styles = StyleSheet.create({
  // Next to the 72px 404: about 0.55em wide and cap-height tall.
  display: { borderRadius: 2, height: 50, marginLeft: 6, width: 40 },
  hero: { borderRadius: 1, height: 20, marginLeft: 6, width: 10 },
  small: { borderRadius: 1, height: 16, marginLeft: 4, width: 8 },
});

const SIZES = { display: styles.display, hero: styles.hero, small: styles.small };

export default Caret;
