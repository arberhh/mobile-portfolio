import React from "react";
import Svg, { Path } from "react-native-svg";
import { CELL, COLUMN_WIDTH, DAYS, GRID_HEIGHT, Level, PLACEHOLDER_WEEKS } from "./constants";

export const PLACEHOLDER: Level[][] = Array.from({ length: PLACEHOLDER_WEEKS }, () =>
  Array(DAYS).fill(0),
);

// One SVG path of rounded squares for every cell `keep` accepts.
export function squaresPath(weeks: Level[][], keep: (level: Level) => boolean) {
  const side = CELL - 4;
  return weeks
    .flatMap((week, w) =>
      week.map((level, d) =>
        keep(level)
          ? `M${w * COLUMN_WIDTH + 2},${d * COLUMN_WIDTH}h${side}a2,2 0 0 1 2,2v${side}a2,2 0 0 1 -2,2h-${side}a2,2 0 0 1 -2,-2v-${side}a2,2 0 0 1 2,-2z`
          : "",
      ),
    )
    .join("");
}

// A few paths instead of a view per square keeps native navigation smooth.
export function GridSvg({ paths, width }: { paths: [string, string][]; width: number }) {
  return (
    <Svg width={width} height={GRID_HEIGHT}>
      {paths.map(([d, color]) => !!d && <Path key={color} d={d} fill={color} />)}
    </Svg>
  );
}

// Outlines, so filling an empty day still visibly changes it.
export function OutlineSvg({ path, color, width }: { path: string; color: string; width: number }) {
  return (
    <Svg width={width} height={GRID_HEIGHT}>
      <Path d={path} fill="none" stroke={color} strokeWidth={1} />
    </Svg>
  );
}
