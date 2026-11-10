import { StyleSheet } from "react-native";
import { FONT_MEDIUM, FONT_SANS_MEDIUM } from "@/constants";
import { INSET, radius, space } from "@/themes";

const styles = StyleSheet.create({
  arrow: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  body: {
    paddingBottom: space.xl,
    paddingHorizontal: INSET,
    paddingTop: space.lg,
  },
  clip: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  container: {
    borderRadius: radius.lg,
  },
  footer: {
    alignItems: "center",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: space.lg,
    paddingTop: space.md,
  },
  hairline: {
    height: 1,
  },
  highlight: {
    borderLeftWidth: 3,
    borderRadius: radius.md,
    marginTop: space.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  highlightText: {
    fontFamily: FONT_SANS_MEDIUM,
    fontSize: 15,
    lineHeight: 22,
  },
  // Banners are exported at 1200x450 (8:3), so `cover` never crops them.
  image: {
    aspectRatio: 8 / 3,
    width: "100%",
  },
  meta: {
    marginTop: space.xs,
  },
  open: {
    fontFamily: FONT_MEDIUM,
    fontSize: 13,
    lineHeight: 20,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 14,
  },
});

export default styles;
