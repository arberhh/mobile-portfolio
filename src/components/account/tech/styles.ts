import { StyleSheet } from "react-native";
import { radius } from "@/themes";

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 28,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});

export default styles;
