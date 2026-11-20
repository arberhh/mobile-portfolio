import { StyleSheet } from "react-native";
import { radius } from "@/themes";

export const ICON_SIZE = 22;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  icons: { height: ICON_SIZE, width: ICON_SIZE },
});

export default styles;
