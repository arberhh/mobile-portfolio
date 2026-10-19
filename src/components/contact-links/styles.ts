import { StyleSheet } from "react-native";
import { FONT_MEDIUM } from "@/constants";

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
  },
  chip: {
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    fontFamily: FONT_MEDIUM,
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export default styles;
