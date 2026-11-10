import { StyleSheet } from "react-native";
import { radius, space } from "@/themes";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: 56,
    paddingHorizontal: space.md,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  title: {
    flex: 1,
    marginHorizontal: space.sm,
    textAlign: "center",
  },
});
export default styles;
