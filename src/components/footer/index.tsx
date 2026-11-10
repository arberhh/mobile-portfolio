import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context";
import { commonStyles } from "@/common";
import { REPO_URL } from "@/constants";
import { INSET, space } from "@/themes";
import ExternalLink from "../external-link";
import Icon from "../icon";

// No year: it would differ between the static build and a render after New Year.
function Footer() {
  const { theme } = useTheme();

  return (
    <View dataSet={{ inset: "" }} style={styles.container}>
      {/* Inside the inset padding, so it starts on the line the section hairlines do. */}
      <View style={[styles.hairline, { backgroundColor: theme.line }]} />
      <Text style={[commonStyles.prompt, { color: theme.textSecondary }]}>
        <Text style={{ color: theme.accentText }}>$</Text> exit 0
      </Text>
      <ExternalLink url={REPO_URL} accessibilityRole="link" style={styles.link}>
        <Icon name="logo-github" size={16} color={theme.textSecondary} />
        <Text style={[commonStyles.bodySmall, { color: theme.textSecondary }]}>
          View this site&apos;s source on GitHub
        </Text>
      </ExternalLink>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.md,
    marginTop: space["5xl"],
    paddingBottom: space["4xl"],
    // Content and hairline on the shared inset line.
    paddingHorizontal: INSET,
  },
  hairline: {
    height: 1,
    marginBottom: space.sm,
  },
  link: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: space.sm,
  },
});

export default Footer;
