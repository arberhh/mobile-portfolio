import React from "react";
import { Linking, Platform, StyleSheet, Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "@/context";
import { FONT_SANS_MEDIUM } from "@/constants";

// Same web-only widening as ExternalLink: react-native-web renders a Text
// with `href` as a real <a>.
type WebTextProps = TextProps & { href?: string; hrefAttrs?: { target?: string; rel?: string } };
const WebText = Text as unknown as React.ComponentType<WebTextProps>;

// Markdown-style `[label](https://…)`, so content can carry inline links.
// Spaces just inside the brackets are captured apart, so they stay outside
// the link and aren't underlined.
const LINK = /\[(\s*)([^\]]*?\S)(\s*)\]\((https?:\/\/[^)\s]+)\)/g;

interface LinkedTextProps {
  style: TextStyle;
  text: string;
  color?: string;
  dataSet?: TextProps["dataSet"];
}

function LinkedText({ style, text, color, dataSet }: LinkedTextProps) {
  const { theme } = useTheme();
  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(LINK)) {
    const [whole, lead, label, trail, url] = match;
    parts.push(text.slice(last, match.index) + lead);
    parts.push(
      <WebText
        key={match.index}
        accessibilityRole="link"
        // Offset and the pink 2px hover underline: WEB_MOTION_CSS.
        dataSet={{ inlineLink: "" }}
        style={[styles.link, { color: theme.text, textDecorationColor: theme.color }]}
        href={Platform.OS === "web" ? url : undefined}
        hrefAttrs={{ target: "_blank", rel: "noopener noreferrer" }}
        onPress={Platform.OS === "web" ? undefined : () => Linking.openURL(url)}
      >
        {label}
      </WebText>,
    );
    parts.push(trail);
    last = match.index + whole.length;
  }
  parts.push(text.slice(last));

  return (
    <Text dataSet={dataSet} style={[style, { color: color ?? theme.text }]}>
      {parts}
    </Text>
  );
}

const styles = StyleSheet.create({
  link: { fontFamily: FONT_SANS_MEDIUM, textDecorationLine: "underline" },
});

export default LinkedText;
