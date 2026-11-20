import React, { ComponentProps, ReactNode, useEffect, useMemo, useRef } from "react";
import { ScrollView, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLUMN_WIDTH, DAYS, FILL_MS, GRID_HEIGHT, Level } from "./constants";
import { GridSvg, OutlineSvg, PLACEHOLDER, squaresPath } from "./grid-svg";
import styles from "./styles";

// Clip moved by `x`/`y` with its content moved back, so only the clip's
// edges move (transforms only, so no frame needs a layout pass).
function Reveal({
  x,
  y,
  style,
  children,
}: {
  x: SharedValue<number>;
  y?: SharedValue<number>;
  style: ComponentProps<typeof Animated.View>["style"];
  children: ReactNode;
}) {
  const clip = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y?.value ?? 0 }],
  }));
  const content = useAnimatedStyle(() => ({
    transform: [{ translateX: -x.value }, { translateY: -(y?.value ?? 0) }],
  }));
  return (
    <Animated.View style={[style, clip]}>
      <Animated.View style={content}>{children}</Animated.View>
    </Animated.View>
  );
}

// Empty grid straight away (the loading state), then the real squares fill
// in on top, down each week and across, from the first on screen to the last.
export default function FillGrid({
  weeks,
  colors,
}: {
  weeks: Level[][] | null;
  colors: readonly string[];
}) {
  const scrollRef = useRef<ScrollView>(null);
  const shape = weeks ?? PLACEHOLDER;
  const width = shape.length * COLUMN_WIDTH;
  const progress = useSharedValue(0);
  // Weeks on screen; it opens scrolled to the end, so the fill covers only those.
  const visible = useSharedValue(shape.length);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!weeks) return;
    progress.set(reduceMotion ? 1 : withTiming(1, { duration: FILL_MS, easing: Easing.linear }));
  }, [weeks, progress, reduceMotion]);

  const emptyPath = useMemo(() => squaresPath(shape, (level) => level !== null), [shape]);
  const levelPaths = useMemo(
    () =>
      colors.map((color, l): [string, string] => [
        weeks ? squaresPath(weeks, (level) => level === l) : "",
        color,
      ]),
    [weeks, colors],
  );

  // Squares filled so far, fractional so the fill moves every frame;
  // off-screen weeks count as already filled.
  const filled = useDerivedValue(() => {
    const onScreen = Math.min(visible.value, shape.length);
    return (shape.length - onScreen + progress.value * onScreen) * DAYS;
  });
  const doneX = useDerivedValue(() => Math.floor(filled.value / DAYS) * COLUMN_WIDTH);
  const finishedX = useDerivedValue(() => doneX.value - width);
  // The current week's clip slides down from above as its squares fill.
  const currentY = useDerivedValue(() => (filled.value % DAYS) * COLUMN_WIDTH - GRID_HEIGHT);

  const grid = <GridSvg paths={levelPaths} width={width} />;

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      // Browsers make the scroller a tab stop, so it needs a name.
      role="group"
      aria-label="GitHub contribution calendar"
      showsHorizontalScrollIndicator={false}
      onLayout={(event) => visible.set(Math.floor(event.nativeEvent.layout.width / COLUMN_WIDTH))}
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
    >
      <View style={{ width, height: GRID_HEIGHT }}>
        <OutlineSvg path={emptyPath} color={colors[0]} width={width} />
        {weeks && (
          <>
            <Reveal x={finishedX} style={styles.clip}>
              {grid}
            </Reveal>
            <Reveal x={doneX} y={currentY} style={styles.currentWeek}>
              {grid}
            </Reveal>
          </>
        )}
      </View>
    </ScrollView>
  );
}
