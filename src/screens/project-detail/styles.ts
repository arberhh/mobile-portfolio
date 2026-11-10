import { StyleSheet } from "react-native";
import { INSET, radius, space } from "@/themes";

const styles = StyleSheet.create({
  // Padding, not margin, so `data-gutter` can widen it to 32 on wide web.
  body: {
    paddingHorizontal: space.xl,
  },
  content: {
    paddingBottom: space["5xl"],
    paddingTop: space.xl,
  },
  description: {
    marginTop: space["2xl"],
  },
  highlight: {
    borderLeftWidth: 3,
    borderRadius: radius.md,
    marginTop: space.xl,
    paddingHorizontal: space.lg,
    paddingVertical: 14,
  },
  inset: {
    paddingHorizontal: INSET,
  },
  link: {
    alignItems: "center",
    borderRadius: radius.md,
    flexDirection: "row",
    gap: space.sm,
    height: 44,
    paddingHorizontal: 18,
  },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: space.xl,
  },
  meta: {
    marginTop: 6,
  },
  secondaryLink: {
    borderWidth: 1.5,
  },
  toolDivider: {
    borderTopWidth: 1,
  },
  // 6 + 6 puts rows 12 apart with the hairline in the middle.
  toolRow: {
    gap: space.xs,
    paddingVertical: 6,
  },
  window: {
    marginBottom: space["2xl"],
    paddingHorizontal: space.xl,
  },
});
export default styles;
