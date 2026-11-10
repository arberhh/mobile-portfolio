import { StyleSheet } from "react-native";
import { radius, space } from "@/themes";

const NAV_BUTTON_SIZE = 40;

// Fixed, not derived from the window or the images: the server render
// knows neither. Narrow web overrides it with CSS (PROJECT_CARD_CSS).
const SLIDE_HEIGHT = 360;
export const NAVIGATION_HEIGHT = space.md + NAV_BUTTON_SIZE;

const styles = StyleSheet.create({
  activeDot: {
    borderRadius: radius.pill,
    height: 6,
    width: 20,
  },
  area: {
    height: SLIDE_HEIGHT,
  },
  dot: {
    borderRadius: radius.pill,
    height: 6,
    width: 6,
  },
  dots: {
    gap: 6,
  },
  frame: {
    alignItems: "center",
    borderRadius: radius.sm,
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  navButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: NAV_BUTTON_SIZE,
    justifyContent: "center",
    opacity: 0.92,
    width: NAV_BUTTON_SIZE,
  },
  navigation: {
    alignItems: "center",
    flexDirection: "row",
    height: NAVIGATION_HEIGHT,
    justifyContent: "space-between",
    paddingTop: space.md,
  },
  overlay: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
export default styles;
