import React, { useLayoutEffect, useMemo, useRef } from "react";
import { ScrollView, View } from "react-native";
import { animate } from "@/util/web-animate";
import { COLUMN_WIDTH, DAYS, FILL_MS, GRID_HEIGHT, Level } from "./constants";
import { GridSvg, OutlineSvg, PLACEHOLDER, squaresPath } from "./grid-svg";
import styles from "./styles";

type Frames = { clip: Keyframe[]; content: Keyframe[] };

// The same fill as fill-grid.tsx, as keyframes: the finished clip steps right
// a week at a time, and the current week's clip also slides down within each
// week. Each clip's content gets the opposite transform, so only the clip's
// edges move. Off-screen weeks start out filled.
function fillFrames(totalWeeks: number, onScreen: number) {
  const width = totalWeeks * COLUMN_WIDTH;
  const offScreen = totalWeeks - onScreen;
  const finished: Frames = { clip: [], content: [] };
  const current: Frames = { clip: [], content: [] };

  function push(frames: Frames, offset: number, x: number, y: number) {
    frames.clip.push({ offset, transform: `translate(${x}px, ${y}px)` });
    frames.content.push({ offset, transform: `translate(${-x}px, ${-y}px)` });
  }

  for (let i = 0; i < onScreen; i++) {
    const x = (offScreen + i) * COLUMN_WIDTH;
    const [start, end] = [i / onScreen, (i + 1) / onScreen];
    push(finished, start, x - width, 0);
    push(finished, end, x - width, 0);
    push(current, start, x, -GRID_HEIGHT);
    push(current, end, x, DAYS * COLUMN_WIDTH - GRID_HEIGHT);
  }
  // End states, matching the styles rendered below.
  push(finished, 1, 0, 0);
  push(current, 1, width, -GRID_HEIGHT);
  return { finished, current };
}

// Web version of fill-grid.tsx: the browser's Web Animations API instead of
// Reanimated. The rendered styles are the finished grid; the fill animates
// up to it once the data arrives.
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
  const visible = useRef(shape.length);
  const finishedClip = useRef<View>(null);
  const finishedContent = useRef<View>(null);
  const currentClip = useRef<View>(null);
  const currentContent = useRef<View>(null);

  const emptyPath = useMemo(() => squaresPath(shape, (level) => level !== null), [shape]);
  const levelPaths = useMemo(
    () =>
      colors.map((color, l): [string, string] => [
        weeks ? squaresPath(weeks, (level) => level === l) : "",
        color,
      ]),
    [weeks, colors],
  );

  useLayoutEffect(() => {
    if (!weeks) return;
    const onScreen = Math.max(1, Math.min(visible.current, weeks.length));
    const { finished, current } = fillFrames(weeks.length, onScreen);
    const options = { duration: FILL_MS, easing: "linear" };
    animate(finishedClip.current, finished.clip, options);
    animate(finishedContent.current, finished.content, options);
    animate(currentClip.current, current.clip, options);
    animate(currentContent.current, current.content, options);
  }, [weeks]);

  const grid = <GridSvg paths={levelPaths} width={width} />;

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      // Browsers make the scroller a tab stop, so it needs a name.
      role="group"
      aria-label="GitHub contribution calendar"
      showsHorizontalScrollIndicator={false}
      onLayout={(event) => {
        visible.current = Math.floor(event.nativeEvent.layout.width / COLUMN_WIDTH);
      }}
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
    >
      <View style={{ width, height: GRID_HEIGHT }}>
        <OutlineSvg path={emptyPath} color={colors[0]} width={width} />
        {weeks && (
          <>
            <View ref={finishedClip} style={styles.clip}>
              <View ref={finishedContent}>{grid}</View>
            </View>
            <View
              ref={currentClip}
              style={[
                styles.currentWeek,
                { transform: [{ translateX: width }, { translateY: -GRID_HEIGHT }] },
              ]}
            >
              <View
                ref={currentContent}
                style={{ transform: [{ translateX: -width }, { translateY: GRID_HEIGHT }] }}
              >
                {grid}
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
