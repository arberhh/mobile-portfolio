import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useTheme } from "@/context";
import { ProjectProps } from "@/types";
import { commonStyles } from "@/common";
import styles from "./styles";
import ThemeText from "../theme-text";

// A real <Link> (an <a href> on web) so crawlers and middle-click/
// "copy link" work, not just taps.
function Project({ project }: ProjectProps) {
  const { theme } = useTheme();
  const { slug, title, role, period, highlight, banner_url, banner_alt, domains } = project;
  const meta = [role, period].filter(Boolean).join(" · ");

  return (
    <Link href={`/project/${slug}`} asChild>
      <Pressable style={styles.container} accessibilityLabel={`${title} case study`}>
        <Image
          source={{ uri: banner_url }}
          contentFit="contain"
          transition={200}
          alt={banner_alt || `${title} banner`}
          accessibilityLabel={banner_alt || `${title} banner`}
          style={[styles.image, { backgroundColor: theme.cardBackground }]}
        />
        <View style={[styles.body, { backgroundColor: theme.cardBackground }]}>
          <ThemeText text={title} style={styles.title} />
          {meta !== "" && <ThemeText text={meta} style={styles.meta} color={theme.textSecondary} />}
          {highlight !== "" && (
            <ThemeText text={`> ${highlight}`} style={styles.highlight} color={theme.color} />
          )}
          <View style={[commonStyles.row, commonStyles.mt10]}>
            {domains.map((domain) => (
              <Text style={[styles.domains, { color: theme.accent }]} key={domain.id}>
                {`#${domain.title}`}
              </Text>
            ))}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export default Project;
