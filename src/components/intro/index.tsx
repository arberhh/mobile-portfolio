import React from "react";
import { Text } from "react-native";
import { ThemeScope, useTheme } from "@/context";
import { darkTheme } from "@/themes";
import { Profile } from "@/types";
import { commonStyles } from "@/common";
import Caret from "../caret";
import ContactLinks from "../contact-links";
import TerminalWindow from "../terminal-window";
import ThemeText from "../theme-text";
import styles from "./styles";

interface IntroProps {
  profile: Profile;
}

// Inside the dark ThemeScope, so useTheme here returns the dark theme.
function HeroContent({ profile }: IntroProps) {
  const { theme } = useTheme();

  return (
    <>
      <Text style={[commonStyles.prompt, styles.prompt, { color: theme.textSecondary }]}>
        <Text style={{ color: theme.accentText }}>$</Text> whoami
      </Text>
      {/* `data-display` grows the name on wide web (WEB_SHELL_CSS). */}
      <Text
        dataSet={{ display: "" }}
        style={[commonStyles.display, styles.name, { color: theme.text }]}
        accessibilityRole="header"
      >
        {profile.name}
        <Caret />
      </Text>
      {!!profile.headline && (
        <ThemeText
          style={[commonStyles.lead, styles.headline]}
          text={profile.headline}
          color={theme.textSecondary}
        />
      )}
      {!!profile.intro && (
        <Text
          dataSet={{ measure: "" }}
          style={[commonStyles.body, styles.intro, { color: theme.textSecondary }]}
        >
          {profile.intro}
        </Text>
      )}
      <ContactLinks profile={profile} />
    </>
  );
}

// Home's first block: who this is, what they do, and how to reach them,
// so a visitor doesn't have to find the profile icon to learn any of it.
// Always a navy terminal (SPEC-53); on a light page it gets a deeper shadow.
function Intro({ profile }: IntroProps) {
  const { theme } = useTheme();

  return (
    <ThemeScope theme={darkTheme}>
      <TerminalWindow title="arber@portfolio: ~" raised={theme.theme === "light"}>
        <HeroContent profile={profile} />
      </TerminalWindow>
    </ThemeScope>
  );
}

export default Intro;
