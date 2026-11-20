import React, { useState } from "react";
import { View } from "react-native";
import SlideshowCarousel from "./carousel";
import styles, { NAVIGATION_HEIGHT } from "./styles";

interface SlideshowProps {
  images: string[];
  // Project title, used to give each screenshot alt text.
  title: string;
  onImagePress: (url: string) => void;
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
