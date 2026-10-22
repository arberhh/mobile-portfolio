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
import styles, { COLUMN_WIDTH } from "./styles";

const WEEKS = 53;
const DAYS = 7;
// How many columns are mid-fade at once along the fill's leading edge.
const EDGE = 3;
const CYCLE_MS = 3200;
// Share of each cycle spent filling; the rest fades the full grid out.
const FILL_END = 0.8;

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
  // Columns on screen; the grid opens scrolled to the end, so the fill runs
  // across only those, starting from the leftmost visible one.
  visible: SharedValue<number>;
  colors: readonly string[];
}

function GhostColumn({ week, progress, visible, colors }: ColumnProps) {
  // Columns light up one after another from left to right and stay lit until
  // the grid is full, then everything fades out and the fill starts over.
  const litStyle = useAnimatedStyle(() => {
    const position = Math.max(0, week - (WEEKS - visible.value));
    const head = Math.min(progress.value / FILL_END, 1) * (visible.value + EDGE);
    const filled = Math.min(Math.max((head - position) / EDGE, 0), 1);
    const fadeOut =
      progress.value < FILL_END ? 1 : 1 - (progress.value - FILL_END) / (1 - FILL_END);
    return { opacity: filled * fadeOut };
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
  const visible = useSharedValue(WEEKS);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    progress.set(withRepeat(withTiming(1, { duration: CYCLE_MS, easing: Easing.linear }), -1));
  }, [progress, reduceMotion]);

  return (
    <View accessible accessibilityLabel="Loading GitHub contributions">
      <ThemeText style={styles.total} text="Fetching contributions…" color={theme.textSecondary} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onLayout={(event) =>
          visible.set(Math.min(WEEKS, Math.floor(event.nativeEvent.layout.width / COLUMN_WIDTH)))
        }
        // Match the real graph, which opens on the most recent weeks.
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        <View style={styles.grid}>
          {Array.from({ length: WEEKS }, (_, week) => (
            <GhostColumn
              key={week}
              week={week}
              progress={progress}
              visible={visible}
              colors={colors}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
