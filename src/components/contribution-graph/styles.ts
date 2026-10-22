import { StyleSheet } from "react-native";
import { FONT_REGULAR } from "@/constants";

const CELL = 10;
const GAP = 3;

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
  total: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    marginBottom: 10,
  },
});

export default styles;
