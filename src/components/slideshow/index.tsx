import React, { useCallback, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { Carousel, Pagination } from "react-native-reanimated-carousel";
import type { CarouselRef, CarouselRenderItemInfo } from "react-native-reanimated-carousel";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useTheme } from "@/context";
import { cardElevation } from "@/themes";
import Icon from "../icon";
import styles, { NAVIGATION_HEIGHT } from "./styles";

interface SlideshowProps {
  images: string[];
  // Project title, used to give each screenshot alt text.
  title: string;
  onImagePress: (url: string) => void;
}

interface SlideItemProps {
  uri: string;
  alt: string;
  width: number;
  height: number;
  relativeProgress: SharedValue<number>;
  onPress: () => void;
}

function SlideItem({ uri, alt, width, height, relativeProgress, onPress }: SlideItemProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(relativeProgress.value, [-1, 0, 1], [0.6, 1, 0.6], Extrapolation.CLAMP),
  }));

  // expo-image only emits `alt` on web from accessibilityLabel.
  return (
    <Animated.View style={[{ width, height }, animatedStyle]}>
      <Pressable
        style={styles.frame}
        onPress={onPress}
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
          // On web, native browser drag-to-select-image intercepts the mouse
          // gesture before the carousel's pan gesture can recognize a swipe,
          // so a click-and-drag never changes the slide. Disabling it lets
          // mouse drag work the same as touch swipe. No-op on native.
          draggable={false}
        />
      </Pressable>
    </Animated.View>
  );
}

interface NavButtonProps {
  side: "left" | "right";
  onPress: () => void;
}

function NavButton({ side, onPress }: NavButtonProps) {
  const { theme } = useTheme();
  const isLeft = side === "left";

  return (
    <Pressable
      style={[
        styles.navButton,
        cardElevation[theme.theme],
        { backgroundColor: theme.cardBackground },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={isLeft ? "Previous image" : "Next image"}
    >
      <Icon name={isLeft ? "chevron-back" : "chevron-forward"} size={20} color={theme.text} />
    </Pressable>
  );
}

interface SlideshowCarouselProps {
  images: string[];
  title: string;
  width: number;
  height: number;
  onImagePress: (url: string) => void;
  initialIndex?: number;
}

function SlideshowCarousel({
  images,
  title,
  width,
  height,
  onImagePress,
  initialIndex = 0,
}: SlideshowCarouselProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(initialIndex);
  const carouselRef = useRef<CarouselRef>(null);

  function handlePrevious() {
    carouselRef.current?.prev();
  }

  function handleNext() {
    carouselRef.current?.next();
  }

  function onPressPagination(index: number) {
    carouselRef.current?.scrollTo({
      index,
      animated: true,
    });
  }

  const dotStyle = { ...styles.dot, backgroundColor: theme.dotInactive };
  const activeDotStyle = { ...styles.activeDot, backgroundColor: theme.color };

  const renderItem = useCallback(
    ({ item, index, relativeProgress }: CarouselRenderItemInfo<string>) => (
      <SlideItem
        uri={item}
        alt={`${title} screenshot ${index + 1} of ${images.length}`}
        width={width}
        height={height}
        relativeProgress={relativeProgress}
        onPress={() => onImagePress(item)}
      />
    ),
    [width, height, onImagePress, title, images.length],
  );

  if (images.length === 0) return null;

  return (
    <View style={{ width }}>
      <View style={{ width, height }}>
        <Carousel
          ref={carouselRef}
          data={images}
          style={{ width, height }}
          loop={images.length > 1}
          defaultIndex={initialIndex}
          progress={progress}
          layout={{ type: "parallax", offset: 0, scale: 1, adjacentScale: 0.92 }}
          renderItem={renderItem}
        />
      </View>
      {/* Buttons sit beside the dots, not over the screenshot. */}
      {images.length > 1 && (
        <View style={styles.navigation}>
          <NavButton side="left" onPress={handlePrevious} />
          <Pagination
            count={images.length}
            progress={progress}
            containerStyle={styles.dots}
            dotStyle={dotStyle}
            activeDotStyle={activeDotStyle}
            onPress={onPressPagination}
          />
          <NavButton side="right" onPress={handleNext} />
        </View>
      )}
    </View>
  );
}

// The slide area's size comes from layout alone, never from the images, so
// the static HTML already has the final layout (no shift on load). Native
// uses SLIDE_HEIGHT; on narrow web PROJECT_CARD_CSS turns `data-slide-area`
// into a square. The carousel needs numbers, so it renders once onLayout
// gives the area's size, overlaid on it; its dots row hangs below the area
// into the reserved bottom padding.
function Slideshow({ images = [], title, onImagePress }: SlideshowProps) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const navigationHeight = images.length > 1 ? NAVIGATION_HEIGHT : 0;

  if (images.length === 0) return null;

  return (
    <View style={{ paddingBottom: navigationHeight }}>
      <View
        dataSet={{ slideArea: "" }}
        style={styles.area}
        onLayout={(e) => setSize(e.nativeEvent.layout)}
      >
        {size !== null && (
          <View style={styles.overlay}>
            <SlideshowCarousel
              images={images}
              title={title}
              width={size.width}
              height={size.height}
              onImagePress={onImagePress}
            />
          </View>
        )}
      </View>
    </View>
  );
}

export default Slideshow;
export { SlideshowCarousel };
