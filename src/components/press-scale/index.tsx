import React, { ReactNode } from "react";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SPRING_PRESS } from "@/constants/motion";

export interface PressHandlers {
  onPressIn?: () => void;
  onPressOut?: () => void;
}

const SPRING = { ...SPRING_PRESS, reduceMotion: ReduceMotion.System };

// Springs its pressable down to 98% while pressed. Web does this with CSS
// `:active` on `data-card` / `data-contact` instead (index.web.tsx).
export default function PressScale({
  children,
}: {
  children: (handlers: PressHandlers) => ReactNode;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Animated.View style={style}>
      {children({
        onPressIn: () => scale.set(withSpring(0.98, SPRING)),
        onPressOut: () => scale.set(withSpring(1, SPRING)),
      })}
    </Animated.View>
  );
}
