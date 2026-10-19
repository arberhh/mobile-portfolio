import { StyleSheet } from "react-native";
import { FONT_MEDIUM } from "@/constants";

const styles = StyleSheet.create({
  container: {
    paddingBottom: 4,
    paddingHorizontal: 10,
    paddingTop: 16,
  },
  headline: {
    fontFamily: FONT_MEDIUM,
    fontSize: 15,
    marginBottom: 10,
  },
  links: {
    marginBottom: 28,
    marginTop: 16,
  },
  name: {
    fontFamily: FONT_MEDIUM,
    fontSize: 26,
    marginBottom: 6,
  },
  prompt: {
    fontFamily: FONT_MEDIUM,
    fontSize: 12,
    marginBottom: 8,
  },
});

export default styles;
