import { StyleSheet } from "react-native";
import { INSET, radius, space } from "@/themes";
import { COLUMN_WIDTH, GRID_HEIGHT } from "./constants";

// The `h2` line height, so a digit window shows exactly one digit.
export const LINE_HEIGHT = 28;

const styles = StyleSheet.create({
  // Horizontal padding is the shared inset; web widens it via `data-inset`.
  card: {
    borderRadius: radius.lg,
    paddingHorizontal: INSET,
    paddingVertical: space.lg,
  },
  // A grid copy over the empty grid, partly revealed.
  clip: {
    bottom: 0,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
  },
  container: {
    alignSelf: "stretch",
  },
  // The week being filled.
  currentWeek: {
    height: GRID_HEIGHT,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    width: COLUMN_WIDTH,
  },
  // Window onto a rolling digit strip, one digit tall.
  digit: {
    height: LINE_HEIGHT,
    overflow: "hidden",
  },
  // Bottom-aligned so the small suffix sits on the big number's line.
  suffix: {
    marginBottom: 2,
  },
  total: {
    alignItems: "flex-end",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: space.md,
  },
  totalText: {
    height: LINE_HEIGHT,
  },
});

export default styles;
