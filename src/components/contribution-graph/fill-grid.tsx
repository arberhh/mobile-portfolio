import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TRANSPARENT } from "@/constants";
import styles, { COLUMN_WIDTH } from "./styles";

const DAYS = 7;
// How many squares are mid-fade at once along the fill's leading edge.
const EDGE = 4;
const FILL_MS = 6000;
const HOLD_MS = 800;
const FADE_MS = 700;

// One square's level (0-4), or null for the padding before the first day.
export type Level = number | null;

interface CellProps {
  week: number;
  day: number;
  level: Level;
  weekCount: number;
  progress: SharedValue<number>;
  fade: SharedValue<number>;
  // Columns on screen; the grid opens scrolled to the end, so the fill runs
  // across only those, starting from the leftmost visible one.
  visible: SharedValue<number>;
  colors: readonly string[];
}

function Cell({ week, day, level, weekCount, progress, fade, visible, colors }: CellProps) {
  // Squares light up one at a time, down each week and then on to the next.
  const litStyle = useAnimatedStyle(() => {
    const onScreen = Math.min(visible.value, weekCount);
    const order = Math.max(0, week - (weekCount - onScreen)) * DAYS + day;
    const head = progress.value * (onScreen * DAYS + EDGE);
    const filled = Math.min(Math.max((head - order) / EDGE, 0), 1);
    return { opacity: filled * fade.value };
  });

  if (level === null) return <View style={[styles.cell, { backgroundColor: TRANSPARENT }]} />;

  return (
    <View style={[styles.cell, { backgroundColor: colors[0] }]}>
      <Animated.View
        style={[styles.cell, styles.litCell, { backgroundColor: colors[level] }, litStyle]}
      />
    </View>
  );
}

interface FillGridProps {
  weeks: Level[][];
  // Whether `weeks` is the real data yet. Until it is, the fill loops over
  // whatever placeholder `weeks` it's given.
  loaded: boolean;
  colors: readonly string[];
}

// Fills the grid from the first square on screen to the last, then stops if
// the real data is in by then; otherwise it fades out and fills again. Data
// that arrives mid-fill just colors the squares the fill hasn't reached yet.
export default function FillGrid({ weeks, loaded, colors }: FillGridProps) {
  const scrollRef = useRef<ScrollView>(null);
  const progress = useSharedValue(0);
  const fade = useSharedValue(1);
  const visible = useSharedValue(weeks.length);
  const loadedRef = useRef(loaded);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);

  useEffect(() => {
    if (reduceMotion) {
      progress.set(1);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    function fill() {
      progress.set(0);
      fade.set(1);
      progress.set(withTiming(1, { duration: FILL_MS, easing: Easing.linear }));
      timer = setTimeout(() => {
        if (loadedRef.current) return;
        fade.set(withTiming(0, { duration: FADE_MS }));
        timer = setTimeout(fill, FADE_MS);
      }, FILL_MS + HOLD_MS);
    }
    fill();
    return () => clearTimeout(timer);
  }, [progress, fade, reduceMotion]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      onLayout={(event) => visible.set(Math.floor(event.nativeEvent.layout.width / COLUMN_WIDTH))}
      // Open on the most recent weeks.
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
    >
      <View style={styles.grid}>
        {weeks.map((week, w) => (
          <View key={w} style={styles.column}>
            {week.map((level, d) => (
              <Cell
                key={d}
                week={w}
                day={d}
                level={level}
                weekCount={weeks.length}
                progress={progress}
                fade={fade}
                visible={visible}
                colors={colors}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
