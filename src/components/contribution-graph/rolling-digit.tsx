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
import { commonStyles } from "@/common";
import { ROLL_MS, STAGGER_MS, STRIP } from "./constants";
import styles, { LINE_HEIGHT } from "./styles";

export interface RollingDigitProps {
  digit: number | null;
  index: number;
  color: string;
}

// A 0-9 strip showing 0 until `digit` arrives, then rolling up to it.
export default function RollingDigit({ digit, index, color }: RollingDigitProps) {
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
          <Text key={i} style={[commonStyles.h2, styles.totalText, { color }]}>
            {n}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}
