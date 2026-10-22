import { StyleSheet } from "react-native";
import { FONT_REGULAR } from "@/constants";
import { COLUMN_WIDTH, GRID_HEIGHT } from "./constants";

export const LINE_HEIGHT = 16;

const styles = StyleSheet.create({
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
    marginHorizontal: 20,
    marginVertical: 10,
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
  total: {
    flexDirection: "row",
    marginBottom: 10,
  },
  totalText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    height: LINE_HEIGHT,
    lineHeight: LINE_HEIGHT,
  },
});

export default styles;
