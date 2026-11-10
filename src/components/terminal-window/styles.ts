import { StyleSheet } from "react-native";
import { FONT_REGULAR } from "@/constants";
import { INSET, radius, space } from "@/themes";

const DOT_SIZE = 10;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: INSET,
    paddingVertical: space.xl,
  },
  container: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  dot: {
    borderRadius: radius.pill,
    height: DOT_SIZE,
    width: DOT_SIZE,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    width: DOT_SIZE * 3 + 6 * 2,
  },
  raised: {
    boxShadow: "0 24px 48px rgba(11,37,69,0.28)",
  },
  title: {
    flex: 1,
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    lineHeight: 16,
    marginHorizontal: space.sm,
    textAlign: "center",
  },
  titleBar: {
    alignItems: "center",
    flexDirection: "row",
    height: 36,
    paddingHorizontal: 14,
  },
});

export default styles;
