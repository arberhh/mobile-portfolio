import { StyleSheet } from "react-native";
import { FONT_MEDIUM } from "@/constants";

const styles = StyleSheet.create({
  itemSeparator: {
    marginHorizontal: -20,
  },
  // Same as Intro's `$ whoami` prompt.
  prompt: {
    fontFamily: FONT_MEDIUM,
    fontSize: 12,
    marginBottom: 8,
    marginTop: 24,
    paddingHorizontal: 10,
  },
  repoIcon: {
    marginRight: 6,
  },
  repoLink: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
  },
});

export default styles;
