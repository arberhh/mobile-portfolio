import { StyleSheet } from "react-native";
import { INSET, radius, space } from "@/themes";

const AVATAR = 112;
const RING = 3;

const styles = StyleSheet.create({
  // Ring, then a card-coloured gap (the padding), then the photo.
  avatar: {
    borderRadius: radius.pill,
    height: AVATAR - RING * 4,
    width: AVATAR - RING * 4,
  },
  avatarRing: {
    borderRadius: radius.pill,
    borderWidth: RING,
    height: AVATAR,
    padding: RING,
    width: AVATAR,
  },
  card: {
    alignItems: "center",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  contactLinks: {
    alignSelf: "stretch",
    marginTop: space.xl,
  },
  content: {
    paddingTop: space.sm,
  },
  headline: {
    marginTop: space.sm,
    textAlign: "center",
  },
  heroBand: {
    height: 360,
    left: 0,
    pointerEvents: "none",
    position: "absolute",
    right: 0,
    top: 0,
  },
  // Native value of the shared inset; web widens it via `data-inset`.
  inset: {
    paddingHorizontal: INSET,
  },
  name: {
    marginTop: space.lg,
    textAlign: "center",
  },
});
export default styles;
