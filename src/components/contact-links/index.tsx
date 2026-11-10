import React from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/context";
import { commonStyles } from "@/common";
import { SPRING_PRESS } from "@/constants/motion";
import { Profile } from "@/types";
import ExternalLink from "../external-link";
import Icon, { IconName } from "../icon";
import styles from "./styles";

interface ContactLink {
  label: string;
  url: string;
  icon: IconName;
}

interface ContactLinksProps {
  profile: Pick<Profile, "email" | "linkedin" | "github" | "cv_url">;
  center?: boolean;
}

function buildLinks({ email, linkedin, github, cv_url }: ContactLinksProps["profile"]) {
  const links: (ContactLink | null)[] = [
    email ? { label: "Email", url: `mailto:${email}`, icon: "mail" } : null,
    linkedin ? { label: "LinkedIn", url: linkedin, icon: "logo-linkedin" } : null,
    github ? { label: "GitHub", url: github, icon: "logo-github" } : null,
    cv_url ? { label: "CV", url: cv_url, icon: "document-text" } : null,
  ];
  return links.filter((link): link is ContactLink => link !== null);
}

// Web hover (fill / brightness) is CSS on `data-contact` in WEB_MOTION_CSS.
function ContactButton({ link, primary }: { link: ContactLink; primary: boolean }) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const press = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const color = primary ? theme.onAccent : theme.text;

  function pressTo(value: number) {
    if (!reduceMotion) scale.set(withSpring(value, SPRING_PRESS));
  }

  return (
    <Animated.View style={press}>
      <ExternalLink
        url={link.url}
        accessibilityRole="link"
        accessibilityLabel={link.label}
        // The button's own theme, not the shell's: it may sit in a ThemeScope.
        dataSet={{ contact: primary ? "primary" : "secondary", contactTheme: theme.theme }}
        onPressIn={() => pressTo(0.98)}
        onPressOut={() => pressTo(1)}
        style={[
          styles.button,
          primary
            ? { backgroundColor: theme.accent, borderColor: theme.accent }
            : { backgroundColor: theme.cardBackground, borderColor: theme.chipBorder },
        ]}
      >
        <Icon name={link.icon} size={16} color={color} />
        <Text style={[commonStyles.button, { color }]}>{link.label}</Text>
      </ExternalLink>
    </Animated.View>
  );
}

// Labelled buttons rather than bare icons: "Email" needs to read as email,
// and screen readers need a name for each link. The first one is the call to
// action, so it's the only pink one.
function ContactLinks({ profile, center = false }: ContactLinksProps) {
  return (
    <View style={[styles.row, center && styles.center]}>
      {buildLinks(profile).map((link, index) => (
        <ContactButton key={link.label} link={link} primary={index === 0} />
      ))}
    </View>
  );
}

export default ContactLinks;
