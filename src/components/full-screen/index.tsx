import React from "react";
import { Modal, Pressable, useWindowDimensions, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context";
import { FullScreenSlideshowProps } from "@/types";
import Icon from "../icon";
import { SlideshowCarousel } from "../slideshow";
import styles from "./styles";

function FullScreenSlideshow({
  visible,
  onClose,
  images,
  initialIndex = 0,
}: FullScreenSlideshowProps) {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <SafeAreaView
        style={[styles.modalContainer, { width, height, backgroundColor: theme.screenBackground }]}
      >
        <Pressable style={[styles.closeButton, { top: insets.top }]} onPress={onClose} hitSlop={12}>
          <Icon name="close" size={28} color={theme.color} />
        </Pressable>
        <View style={[styles.content, { width, height }]}>
          <SlideshowCarousel
            key={initialIndex}
            images={images}
            width={width * 0.9}
            height={height * 0.6}
            initialIndex={initialIndex}
            onImagePress={onClose}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default FullScreenSlideshow;
