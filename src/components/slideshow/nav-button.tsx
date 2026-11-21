import React from "react";
import { Pressable } from "react-native";
import { useTheme } from "@/context";
import { cardElevation } from "@/themes";
import Icon from "../icon";
import styles from "./styles";

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

export default NavButton;
