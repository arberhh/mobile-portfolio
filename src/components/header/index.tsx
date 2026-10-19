import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "@/context";
import Icon from "../icon";
import ThemeText from "../theme-text";
import styles from "./styles";

interface HeaderProps {
  title: string;
  leftIcon: "back" | "account";
  onLeftPress: () => void;
}

function Header({ title, leftIcon, onLeftPress }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
      <Pressable style={styles.iconButton} onPress={onLeftPress} hitSlop={12}>
        <Icon
          name={leftIcon === "back" ? "chevron-back" : "person-circle"}
          size={24}
          color={theme.color}
        />
      </Pressable>
      <ThemeText style={styles.title} text={title} color={theme.accent} numberOfLines={1} />
      <Pressable style={styles.iconButton} onPress={toggleTheme} hitSlop={12}>
        <Icon name="moon" size={22} color={theme.color} />
      </Pressable>
    </View>
  );
}

export default Header;
