import { StyleSheet } from "react-native";
import { FONT_MEDIUM, FONT_REGULAR } from "@/constants";

const styles = StyleSheet.create({
  body: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  highlight: {
    fontFamily: FONT_MEDIUM,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  link: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  linkLabel: {
    fontFamily: FONT_MEDIUM,
    fontSize: 13,
  },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  meta: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    marginBottom: 8,
  },
});
export default styles;
