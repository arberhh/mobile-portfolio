import React from "react";
import { Text, View } from "react-native";
import { commonStyles } from "@/common";
import { TechProps } from "@/types";
import styles from "./styles";

// Shared chip for tech names and `#domain` tags; the caller lays them out
// in a wrapping row with a 6 gap.
export default function Tech({ title, theme }: TechProps) {
  return (
    <View style={[styles.chip, { backgroundColor: theme.surfaceRaised }]}>
      <Text style={[commonStyles.chip, { color: theme.textSecondary }]}>{title}</Text>
    </View>
  );
}
