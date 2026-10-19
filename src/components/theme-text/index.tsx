import React from "react";
import { Text } from "react-native";
import { useTheme } from "@/context";
import { ThemeTextProps } from "@/types";

export default function ThemeText({
  style,
  text,
  color,
  numberOfLines,
  accessibilityRole,
}: ThemeTextProps) {
  const { theme } = useTheme();
  return (
    <Text
      style={[style, { color: color ?? theme.text }]}
      numberOfLines={numberOfLines}
      accessibilityRole={accessibilityRole}
    >
      {text}
    </Text>
  );
}
