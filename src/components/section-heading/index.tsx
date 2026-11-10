import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/context";
import { commonStyles } from "@/common";
import { SectionHeadingProps } from "@/types";
import styles from "./styles";

interface PromptHeadingProps {
  command: string;
  // Number of items in the section, derived from the data.
  count?: number;
  // The first prompt after a hero sits closer to it (24 instead of 40).
  first?: boolean;
}

function PromptHeading({ command, count, first = false }: PromptHeadingProps) {
  const { theme } = useTheme();
  return (
    // Inset like window and card bodies, so the prompt sits on the content line.
    <View
      dataSet={{ inset: "" }}
      style={[styles.row, styles.inset, first ? styles.promptFirst : styles.prompt]}
    >
      <Text
        style={[commonStyles.prompt, { color: theme.color }]}
        accessibilityRole="header"
        aria-level={2}
      >
        <Text style={{ color: theme.accentText }}>$</Text> {command}
      </Text>
      {count !== undefined && (
        <View style={[styles.count, { backgroundColor: theme.surfaceRaised }]}>
          <Text style={[commonStyles.chip, { color: theme.textSecondary }]}>{count}</Text>
        </View>
      )}
      <View style={[styles.hairline, { backgroundColor: theme.line }]} />
    </View>
  );
}

export default function SectionHeading({ bracket, title }: SectionHeadingProps) {
  const { theme } = useTheme();
  return (
    <View dataSet={{ inset: "" }} style={[styles.row, styles.inset, styles.bracket]}>
      <Text
        style={[commonStyles.label, styles.bracketText, { color: theme.textSecondary }]}
        numberOfLines={1}
        accessibilityRole="header"
        aria-level={2}
      >
        <Text style={{ color: theme.color }}>{bracket}</Text> {title}
      </Text>
      <View style={[styles.hairline, styles.bracketHairline, { backgroundColor: theme.line }]} />
    </View>
  );
}

export { PromptHeading };
