import React from "react";
import { View } from "react-native";
import { useTheme } from "@/context";
import { Profile } from "@/types";
import { commonStyles } from "@/common";
import ContactLinks from "../contact-links";
import ThemeText from "../theme-text";
import styles from "./styles";

interface IntroProps {
  profile: Profile;
}

// Home's first block: who this is, what they do, and how to reach them,
// so a visitor doesn't have to find the profile icon to learn any of it.
function Intro({ profile }: IntroProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ThemeText style={styles.prompt} text="$ whoami" color={theme.color} />
      <ThemeText style={styles.name} text={profile.name ?? ""} accessibilityRole="header" />
      {!!profile.headline && (
        <ThemeText style={styles.headline} text={profile.headline} color={theme.accent} />
      )}
      {!!profile.intro && (
        <ThemeText style={commonStyles.subtitle} text={profile.intro} color={theme.textSecondary} />
      )}
      <View style={styles.links}>
        <ContactLinks profile={profile} />
      </View>
      <ThemeText style={styles.prompt} text="$ ls ./projects" color={theme.color} />
    </View>
  );
}

export default Intro;
