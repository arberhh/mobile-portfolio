import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useTheme } from "@/context";
import { ProjectProps } from "@/types";
import { commonStyles } from "@/common";
import { SPRING_PRESS } from "@/constants/motion";
import { cardElevation } from "@/themes";
import { Tech } from "../account";
import Icon from "../icon";
import { formatMeta } from "./meta";
import styles from "./styles";

const PRESS_SPRING = { ...SPRING_PRESS, reduceMotion: ReduceMotion.System };

// A real <Link> (an <a href> on web) so crawlers and middle-click/
// "copy link" work, not just taps. Web hover/press is CSS (PROJECT_CARD_CSS
// on `data-card`); the spring scale below is what native shows on press.
// `priority` is for the first card: its banner is the page's largest paint.
function Project({ project, priority = false }: ProjectProps & { priority?: boolean }) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const { slug, title, role, period, highlight, banner_url, banner_alt, domains } = project;
  const meta = formatMeta(role, period);

  function onPressIn() {
    scale.set(withSpring(0.98, PRESS_SPRING));
  }

  function onPressOut() {
    scale.set(withSpring(1, PRESS_SPRING));
  }

  return (
    <Animated.View style={pressStyle}>
      <Link href={`/project/${slug}`} asChild>
        {/* Link's Slot wants one flat style object. */}
        <Pressable
          dataSet={{ card: theme.theme }}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          accessibilityLabel={`${title} case study`}
          style={StyleSheet.flatten([
            styles.container,
            cardElevation[theme.theme],
            { backgroundColor: theme.cardBackground },
          ])}
        >
          {/* Clipping lives on an inner view: overflow hidden on the shadowed
            view would hide the iOS shadow. */}
          <View style={styles.clip}>
            <Image
              source={{ uri: banner_url }}
              contentFit="cover"
              transition={200}
              priority={priority ? "high" : "normal"}
              loading={priority ? "eager" : undefined}
              alt={banner_alt || `${title} banner`}
              accessibilityLabel={banner_alt || `${title} banner`}
              style={[styles.image, { backgroundColor: theme.surfaceRaised }]}
            />
            <View style={[styles.hairline, { backgroundColor: theme.line }]} />
            {/* `data-inset` gives the same side padding as window bodies on
                web, so card and window text share one left edge. */}
            <View dataSet={{ inset: "" }} style={styles.body}>
              <Text style={[commonStyles.h2, { color: theme.text }]}>{title}</Text>
              {meta !== "" && (
                <Text style={[commonStyles.meta, styles.meta, { color: theme.textSecondary }]}>
                  {meta}
                </Text>
              )}
              {highlight !== "" && (
                <View
                  style={[
                    styles.highlight,
                    { backgroundColor: theme.highlightBackground, borderLeftColor: theme.accent },
                  ]}
                >
                  <Text
                    dataSet={{ measure: "" }}
                    style={[styles.highlightText, { color: theme.text }]}
                  >
                    {highlight}
                  </Text>
                </View>
              )}
              {domains.length > 0 && (
                <View style={styles.tags}>
                  {domains.map((domain) => (
                    <Tech key={domain.id} title={`#${domain.title}`} theme={theme} />
                  ))}
                </View>
              )}
              <View style={[styles.footer, { borderTopColor: theme.line }]}>
                <Text
                  style={[styles.open, { color: theme.textSecondary }]}
                >{`open ./${slug}`}</Text>
                <View
                  dataSet={{ cardArrow: "" }}
                  style={[styles.arrow, { backgroundColor: theme.surfaceRaised }]}
                >
                  <Icon name="arrow-forward" size={18} color={theme.color} />
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Link>
    </Animated.View>
  );
}

export default Project;
