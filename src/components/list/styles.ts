import { StyleSheet } from "react-native";
import { INSET, space } from "@/themes";

const styles = StyleSheet.create({
  // Centres the 6px square on the first 26px line.
  bullet: { borderRadius: 1, height: 6, marginTop: 10, opacity: 0.5, width: 6 },
  item: { flexDirection: "row", gap: space.md },
  items: { gap: 10, paddingHorizontal: INSET },
  text: { flex: 1 },
});

export default styles;
