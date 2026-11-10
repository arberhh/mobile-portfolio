import { StyleSheet } from "react-native";
import { INSET, radius, space } from "@/themes";

const styles = StyleSheet.create({
  bracket: {
    marginBottom: space.md,
    marginTop: space["3xl"],
  },
  bracketHairline: {
    minWidth: 16,
  },
  bracketText: {
    flexShrink: 1,
  },
  count: {
    borderRadius: radius.pill,
    marginLeft: space.sm,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
  },
  hairline: {
    flex: 1,
    height: 1,
    marginLeft: space.md,
  },
  inset: {
    paddingHorizontal: INSET,
  },
  prompt: {
    marginBottom: space.md,
    marginTop: space["4xl"],
  },
  promptFirst: {
    marginBottom: space.md,
    marginTop: space["2xl"],
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
});

export default styles;
