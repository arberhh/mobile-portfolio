import { StyleSheet } from "react-native";
import { radius, space } from "@/themes";

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 6,
    height: 44,
    paddingHorizontal: space.md,
  },
  // Shrinks to its buttons, so one row is centred; once it wraps it fills the
  // width and the rows stay left-aligned instead of centring a lone button.
  center: {
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});

export default styles;
