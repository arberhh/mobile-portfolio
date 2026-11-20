import React, { useLayoutEffect, useRef } from "react";
import { Text, View } from "react-native";
import { commonStyles } from "@/common";
import { animate } from "@/util/web-animate";
import { ROLL_MS, STAGGER_MS, STRIP } from "./constants";
import type { RollingDigitProps } from "./rolling-digit";
import styles, { LINE_HEIGHT } from "./styles";

// Easing.out(Easing.cubic) as CSS.
const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";

// Web version of rolling-digit.tsx: rendered at its landing spot, and rolled
// up to it from 0 with the Web Animations API when the digit arrives.
export default function RollingDigit({ digit, index, color }: RollingDigitProps) {
  const strip = useRef<View>(null);
  const target = digit === null ? 0 : -(10 + digit) * LINE_HEIGHT;

  useLayoutEffect(() => {
    if (digit === null) return;
    animate(
      strip.current,
      [{ transform: "translateY(0px)" }, { transform: `translateY(${target}px)` }],
      // `backwards` holds the 0 through the stagger delay.
      { duration: ROLL_MS, delay: index * STAGGER_MS, easing: EASE_OUT_CUBIC, fill: "backwards" },
    );
  }, [digit, index, target]);

  return (
    <View style={styles.digit}>
      <View ref={strip} style={{ transform: [{ translateY: target }] }}>
        {STRIP.map((n, i) => (
          <Text key={i} style={[commonStyles.h2, styles.totalText, { color }]}>
            {n}
          </Text>
        ))}
      </View>
    </View>
  );
}
