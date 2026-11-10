import { StyleSheet } from "react-native";
import { FONT_SANS_SEMIBOLD } from "@/constants";
import { radius, space } from "@/themes";

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radius.md,
    height: 44,
    justifyContent: "center",
    marginTop: space["2xl"],
    paddingHorizontal: space.lg,
  },
  // Large display numeral (DESIGN §6.15), bigger than any type role.
  code: {
    fontFamily: FONT_SANS_SEMIBOLD,
    fontSize: 72,
    letterSpacing: -1.5,
    lineHeight: 72,
    marginBottom: space.lg,
  },
  prompt: {
    marginBottom: space.xs,
  },
  window: {
    maxWidth: 420,
    width: "100%",
  },
});

export default styles;
