import React, { useCallback, useRef, useState } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
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
import Icon from "../icon";
import styles from "./styles";

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
  const { theme } = useTheme();
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(relativeProgress.value, [-1, 0, 1], [0.6, 1, 0.6], Extrapolation.CLAMP),
  }));
  const frameStyle = [styles.frame, { backgroundColor: theme.cardBackground }];

  return (
    <Animated.View style={[{ width, height }, animatedStyle]}>
      <Pressable
        style={frameStyle}
        onPress={onPress}
        accessibilityRole="imagebutton"
        accessibilityLabel={alt}
      >
        <Image
          contentFit="contain"
          source={{ uri }}
          alt={alt}
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

  const dotStyle = {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.dotInactive,
  };
  const activeDotStyle = {
    width: 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.accent,
  };

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
        {images.length > 1 && (
          <>
            <View style={styles.navigationLeft}>
              <Pressable
                onPress={handlePrevious}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Previous screenshot"
              >
                <Icon name="chevron-back" size={24} color={theme.color} />
              </Pressable>
            </View>
            <View style={styles.navigationRight}>
              <Pressable
                onPress={handleNext}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Next screenshot"
              >
                <Icon name="chevron-forward" size={24} color={theme.color} />
              </Pressable>
            </View>
          </>
        )}
      </View>
      {images.length > 1 && (
        <View style={styles.navigation}>
          <Pagination
            count={images.length}
            progress={progress}
            containerStyle={styles.dots}
            dotStyle={dotStyle}
            activeDotStyle={activeDotStyle}
            onPress={onPressPagination}
          />
        </View>
      )}
    </View>
  );
}

function Slideshow({ images = [], title, onImagePress }: SlideshowProps) {
  const { height } = useWindowDimensions();
  const [width, setWidth] = useState<number | null>(null);
  const slideHeight: number = height / 2.4;

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width !== null && (
        <SlideshowCarousel
          images={images}
          title={title}
          width={width}
          height={slideHeight}
          onImagePress={onImagePress}
        />
      )}
    </View>
  );
}

export default Slideshow;
export { SlideshowCarousel };
