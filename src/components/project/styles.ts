import { StyleSheet } from "react-native";
import { FONT_MEDIUM, FONT_REGULAR } from "@/constants";

const styles = StyleSheet.create({
  body: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  container: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  domains: {
    fontFamily: FONT_MEDIUM,
    fontSize: 13,
    marginRight: 7,
  },
  highlight: {
    fontFamily: FONT_MEDIUM,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  // Banners are exported at 1200x450 (8:3), so the frame matches them
  // exactly at every card width instead of letterboxing in a fixed height.
  image: {
    aspectRatio: 8 / 3,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: "100%",
  },
  meta: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
  },
  title: {
    fontFamily: FONT_MEDIUM,
    fontSize: 18,
    marginBottom: 4,
    marginVertical: 10,
  },
});
export default styles;
