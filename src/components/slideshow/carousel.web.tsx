import React, { useLayoutEffect, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/context";
import type { SlideshowCarouselProps } from "./carousel";
import NavButton from "./nav-button";
import styles from "./styles";

// Web version of carousel.tsx without Reanimated and Gesture Handler: a
// paging ScrollView, which react-native-web renders with CSS scroll-snap, so
// touch swipes, trackpads and arrow keys scroll it natively. The buttons and
// dots wrap around like the native loop.
function SlideshowCarousel({
  images,
  title,
  width,
  height,
  onImagePress,
  initialIndex = 0,
}: SlideshowCarouselProps) {
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(initialIndex);

  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ x: initialIndex * width, animated: false });
  }, [initialIndex, width]);

  function goTo(target: number) {
    const next = (target + images.length) % images.length;
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
  }

  if (images.length === 0) return null;

  return (
    <View style={{ width }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        style={{ width, height }}
      >
        {images.map((uri, i) => {
          const alt = `${title} screenshot ${i + 1} of ${images.length}`;
          // expo-image only emits `alt` on web from accessibilityLabel.
          return (
            <View key={uri} style={{ width, height }}>
              <Pressable
                style={styles.frame}
                onPress={() => onImagePress(uri)}
                accessibilityRole="button"
                accessibilityLabel={alt}
              >
                <Image
                  contentFit="contain"
                  transition={200}
                  source={{ uri }}
                  alt={alt}
                  accessibilityLabel={alt}
                  style={styles.image}
                />
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
      {/* Buttons sit beside the dots, not over the screenshot. */}
      {images.length > 1 && (
        <View style={styles.navigation}>
          <NavButton side="left" onPress={() => goTo(index - 1)} />
          <View style={styles.dots}>
            {images.map((uri, i) => (
              <Pressable
                key={uri}
                onPress={() => goTo(i)}
                accessibilityRole="button"
                accessibilityLabel={`Show screenshot ${i + 1}`}
                style={
                  i === index
                    ? [styles.activeDot, { backgroundColor: theme.color }]
                    : [styles.dot, { backgroundColor: theme.dotInactive }]
                }
              />
            ))}
          </View>
          <NavButton side="right" onPress={() => goTo(index + 1)} />
        </View>
      )}
    </View>
  );
}

export default SlideshowCarousel;
