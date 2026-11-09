import React from "react";
import { Linking, Platform, StyleSheet, Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "@/context";

// Same web-only widening as ExternalLink: react-native-web renders a Text
// with `href` as a real <a>.
type WebTextProps = TextProps & { href?: string; hrefAttrs?: { target?: string; rel?: string } };
const WebText = Text as unknown as React.ComponentType<WebTextProps>;

// Markdown-style `[label](https://…)`, so content can carry inline links.
const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

interface LinkedTextProps {
  style: TextStyle;
  text: string;
  color?: string;
}

function LinkedText({ style, text, color }: LinkedTextProps) {
  const { theme } = useTheme();
  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(LINK)) {
    const [whole, label, url] = match;
    parts.push(text.slice(last, match.index));
    parts.push(
      <WebText
        key={match.index}
        accessibilityRole="link"
        style={[styles.link, { color: theme.accent }]}
        href={Platform.OS === "web" ? url : undefined}
        hrefAttrs={{ target: "_blank", rel: "noopener noreferrer" }}
        onPress={Platform.OS === "web" ? undefined : () => Linking.openURL(url)}
      >
        {label}
      </WebText>,
    );
    last = match.index + whole.length;
  }
  parts.push(text.slice(last));

  return <Text style={[style, { color: color ?? theme.text }]}>{parts}</Text>;
}

const styles = StyleSheet.create({
  link: { textDecorationLine: "underline" },
});

export default LinkedText;
