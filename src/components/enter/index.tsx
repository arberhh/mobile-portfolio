import React, { ReactNode } from "react";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";
import { DURATION, MAX_STAGGER_ITEMS, STAGGER } from "@/constants/motion";

// Staggered entrance for a body section (DESIGN §5). Runs once, on mount.
export default function Enter({ index, children }: { index: number; children: ReactNode }) {
  const entering = FadeInDown.duration(DURATION.enter)
    .delay(Math.min(index, MAX_STAGGER_ITEMS) * STAGGER)
    .reduceMotion(ReduceMotion.System);
  return <Animated.View entering={entering}>{children}</Animated.View>;
}
