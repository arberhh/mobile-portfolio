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
// How many squares are mid-fade at once along the fill's leading edge.
const EDGE = 4;
const FILL_MS = 6000;
const HOLD_MS = 800;
const FADE_MS = 700;
const CYCLE_MS = FILL_MS + HOLD_MS + FADE_MS;
// Points in each cycle (0-1) where the fill ends and the fade-out begins.
const FILL_END = FILL_MS / CYCLE_MS;
const FADE_START = (FILL_MS + HOLD_MS) / CYCLE_MS;

// A fixed fake "year" so the server HTML and the client's first render match
// (no Math.random). Weighted like a real graph: mostly quiet, a few busy days.
function ghostLevel(week: number, day: number) {
  const roll = (Math.imul(week * 7 + day + 1, 2654435761) >>> 0) % 100;
  if (roll < 35) return 0;
  if (roll < 70) return 1;
  if (roll < 88) return 2;
  if (roll < 96) return 3;
  return 4;
}

interface CellProps {
  week: number;
  day: number;
  progress: SharedValue<number>;
  // Columns on screen; the grid opens scrolled to the end, so the fill runs
  // across only those, starting from the leftmost visible one.
  visible: SharedValue<number>;
  colors: readonly string[];
}

function GhostCell({ week, day, progress, visible, colors }: CellProps) {
  // Squares light up one at a time, down each week and then on to the next,
  // and stay lit until the grid is full; then it fades out and starts over.
  const litStyle = useAnimatedStyle(() => {
    const order = Math.max(0, week - (WEEKS - visible.value)) * DAYS + day;
    const head = Math.min(progress.value / FILL_END, 1) * (visible.value * DAYS + EDGE);
    const filled = Math.min(Math.max((head - order) / EDGE, 0), 1);
    const fadeOut =
      progress.value < FADE_START ? 1 : 1 - (progress.value - FADE_START) / (1 - FADE_START);
    return { opacity: filled * fadeOut };
  });

  return (
    <View style={[styles.cell, { backgroundColor: colors[0] }]}>
      <Animated.View
        style={[
          styles.cell,
          styles.litCell,
          { backgroundColor: colors[ghostLevel(week, day)] },
          litStyle,
        ]}
      />
    </View>
  );
}

type ColumnProps = Omit<CellProps, "day">;

function GhostColumn(props: ColumnProps) {
  return (
    <View style={styles.column}>
      {Array.from({ length: DAYS }, (_, day) => (
        <GhostCell key={day} day={day} {...props} />
      ))}
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
