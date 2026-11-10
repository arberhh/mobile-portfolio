import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "@/context";
import { commonStyles } from "@/common";
import { TRANSPARENT } from "@/constants";
import Icon from "../icon";
import ThemeText from "../theme-text";
import ThemeToggle from "../theme-toggle";
import styles from "./styles";

interface HeaderProps {
  title: string;
  leftIcon: "back" | "account";
  onLeftPress: () => void;
  // Home and Profile let the hero band show through.
  transparent?: boolean;
}

function Header({ title, leftIcon, onLeftPress, transparent = false }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: transparent ? TRANSPARENT : theme.screenBackground },
      ]}
    >
      <Pressable
        dataSet={{ iconButton: "" }}
        style={({ pressed }) => [
          styles.iconButton,
          pressed && { backgroundColor: theme.surfaceRaised },
        ]}
        onPress={onLeftPress}
        accessibilityRole="button"
        accessibilityLabel={leftIcon === "back" ? "Go back" : "Open profile"}
      >
        <Icon
          name={leftIcon === "back" ? "chevron-back" : "person-circle"}
          size={22}
          color={theme.color}
        />
      </Pressable>
      <ThemeText style={[commonStyles.headerTitle, styles.title]} text={title} numberOfLines={1} />
      <ThemeToggle />
    </View>
  );
}

export default Header;
