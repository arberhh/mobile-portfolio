import { StyleSheet } from "react-native";
import { FONT_MEDIUM } from "@/constants";

const styles = StyleSheet.create({
  contactLinks: {
    marginBottom: 32,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  container: {
    alignItems: "center",
    paddingTop: 32,
  },
  headline: {
    fontFamily: FONT_MEDIUM,
    fontSize: 15,
    textAlign: "center",
  },
  profileImage: {
    borderRadius: 80,
    height: 160,
    marginBottom: 20,
    width: 160,
  },
  section: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginVertical: 10,
  },
});
export default styles;
