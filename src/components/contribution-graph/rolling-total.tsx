import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/context";
import styles, { LINE_HEIGHT } from "./styles";

const LOADING = "0,000";
// 0-9 twice, so every digit rolls a full turn before landing.
const STRIP = [...Array(20).keys()].map((n) => n % 10);
const STAGGER_MS = 160;
const ROLL_MS = 900;

// A 0-9 strip showing 0 until `digit` arrives, then rolling up to it.
function RollingDigit({
  digit,
  index,
  color,
}: {
  digit: number | null;
  index: number;
  color: string;
}) {
  const y = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (digit === null) return;
    const target = -(10 + digit) * LINE_HEIGHT;
    y.set(
      reduceMotion
        ? target
        : withDelay(
            index * STAGGER_MS,
            withTiming(target, { duration: ROLL_MS, easing: Easing.out(Easing.cubic) }),
          ),
    );
  }, [digit, index, reduceMotion, y]);

  const roll = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  return (
    <View style={styles.digit}>
      <Animated.View style={roll}>
        {STRIP.map((n, i) => (
          <Text key={i} style={[styles.totalText, { color }]}>
            {n}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

// Odometer-style total: zeros while loading, then each digit rolls up to
// `value`'s, one after another from the first.
export default function RollingTotal({ value }: { value: number | null }) {
  const { theme } = useTheme();
  const shape = value === null ? LOADING : value.toLocaleString("en-US");
  let digitIndex = 0;

  return (
    <View style={styles.total}>
      {shape.split("").map((char, i) =>
        /\d/.test(char) ? (
          <RollingDigit
            key={i}
            index={digitIndex++}
            digit={value === null ? null : Number(char)}
            color={theme.textSecondary}
          />
        ) : (
          <Text key={i} style={[styles.totalText, { color: theme.textSecondary }]}>
            {char}
          </Text>
        ),
      )}
      <Text style={[styles.totalText, { color: theme.textSecondary }]}>
        {" contributions in the last year"}
      </Text>
    </View>
  );
}
