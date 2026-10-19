import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/context";
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

// Labelled chips rather than bare icons: "Email" needs to read as email, and
// screen readers need a name for each link.
function ContactLinks({ profile, center = false }: ContactLinksProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.row, center && styles.center]}>
      {buildLinks(profile).map(({ label, url, icon }) => (
        <ExternalLink
          key={label}
          url={url}
          accessibilityRole="link"
          accessibilityLabel={label}
          style={[styles.chip, { borderColor: theme.chipBorder }]}
        >
          <Icon name={icon} size={16} color={theme.accent} />
          <Text style={[styles.label, { color: theme.accent }]}>{label}</Text>
        </ExternalLink>
      ))}
    </View>
  );
}

export default ContactLinks;
