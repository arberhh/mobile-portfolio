import { StyleSheet } from "react-native";
import { space } from "@/themes";

const styles = StyleSheet.create({
  // Full-bleed under the list's 20 gutter.
  heroBand: {
    height: 360,
    left: -space.xl,
    pointerEvents: "none",
    position: "absolute",
    right: -space.xl,
    top: 0,
  },
  itemSeparator: {
    height: space.xl,
  },
});

export default styles;
