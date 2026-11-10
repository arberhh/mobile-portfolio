import { StyleSheet } from "react-native";
import { FONT_MEDIUM } from "@/constants";
import { radius, space } from "@/themes";

const styles = StyleSheet.create({
  brand: {
    alignItems: "center",
    flexDirection: "row",
    height: 48,
    marginBottom: space["3xl"],
    paddingHorizontal: space.lg,
  },
  brandText: {
    fontFamily: FONT_MEDIUM,
    fontSize: 16,
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  link: {
    alignItems: "center",
    borderRadius: radius.pill,
    cursor: "pointer",
    flexDirection: "row",
    gap: space.md,
    height: 48,
    marginBottom: space.sm,
    paddingHorizontal: space.lg,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default styles;
