import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/context";
import ThemeText from "../theme-text";
import styles from "./styles";

const WEEKS = 53;
const DAYS = 7;
// Width of the glowing band, in columns.
const BAND = 6;
const SWEEP_MS = 1800;

// A fixed fake "year" so the server HTML and the client's first render match
// (no Math.random). Roughly a third of the days stay empty, like a real graph.
function ghostLevel(week: number, day: number) {
  const hash = Math.imul(week * 7 + day + 1, 2654435761) >>> 0;
  const level = hash % 6;
  return level > 4 ? 0 : level;
}

interface ColumnProps {
  week: number;
  progress: SharedValue<number>;
  colors: readonly string[];
}

function GhostColumn({ week, progress, colors }: ColumnProps) {
  // A band of light sweeps left to right; each column glows as it passes,
  // briefly showing the fake year underneath.
  const litStyle = useAnimatedStyle(() => {
    const center = progress.value * (WEEKS + BAND * 2) - BAND;
    return { opacity: Math.max(0, 1 - Math.abs(week - center) / BAND) };
  });

  return (
    <View style={styles.column}>
      {Array.from({ length: DAYS }, (_, day) => (
        <View key={day} style={[styles.cell, { backgroundColor: colors[0] }]} />
      ))}
      <Animated.View style={[styles.column, styles.litColumn, litStyle]}>
        {Array.from({ length: DAYS }, (_, day) => (
          <View
            key={day}
            style={[styles.cell, { backgroundColor: colors[ghostLevel(week, day)] }]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

export default function ContributionGraphSkeleton({ colors }: { colors: readonly string[] }) {
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const progress = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    progress.set(
      withRepeat(withTiming(1, { duration: SWEEP_MS, easing: Easing.inOut(Easing.quad) }), -1),
    );
  }, [progress, reduceMotion]);

  return (
    <View accessible accessibilityLabel="Loading GitHub contributions">
      <ThemeText style={styles.total} text="Fetching contributions…" color={theme.textSecondary} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // Match the real graph, which opens on the most recent weeks.
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        <View style={styles.grid}>
          {Array.from({ length: WEEKS }, (_, week) => (
            <GhostColumn key={week} week={week} progress={progress} colors={colors} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
