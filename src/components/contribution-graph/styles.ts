import { StyleSheet } from "react-native";
import { FONT_REGULAR } from "@/constants";

const CELL = 10;
const GAP = 3;
// One week's column plus the gap after it.
export const COLUMN_WIDTH = CELL + GAP;

const styles = StyleSheet.create({
  cell: {
    borderRadius: 2,
    height: CELL,
    width: CELL,
  },
  column: {
    gap: GAP,
  },
  container: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  grid: {
    flexDirection: "row",
    gap: GAP,
  },
  // The skeleton's glowing layer, laid exactly over its column of empty cells.
  litColumn: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  total: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    marginBottom: 10,
  },
});

export default styles;
