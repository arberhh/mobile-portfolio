import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/context";
import { commonStyles } from "@/common";
import RollingDigit from "./rolling-digit";
import styles from "./styles";

const LOADING = "0,000";

// Odometer-style total: zeros while loading, then each digit rolls up to
// `value`'s, one after another from the first.
export default function RollingTotal({ value }: { value: number | null }) {
  const { theme } = useTheme();
  const shape = value === null ? LOADING : value.toLocaleString("en-US");
  let digitIndex = 0;

  return (
    <View style={styles.total}>
      {shape.split("").map((char, i) =>
        /\d/.test(char) ? (
          <RollingDigit
            key={i}
            index={digitIndex++}
            digit={value === null ? null : Number(char)}
            color={theme.text}
          />
        ) : (
          <Text key={i} style={[commonStyles.h2, styles.totalText, { color: theme.text }]}>
            {char}
          </Text>
        ),
      )}
      <Text style={[commonStyles.bodySmall, styles.suffix, { color: theme.textSecondary }]}>
        {" contributions in the last year"}
      </Text>
    </View>
  );
}
