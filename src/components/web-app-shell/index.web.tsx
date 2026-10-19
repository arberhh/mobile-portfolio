import { useState } from "react";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import { Link, usePathname } from "expo-router";
import { useTheme } from "@/context";
import Icon, { IconName } from "../icon";
import ThemeText from "../theme-text";
import { Props } from "@/types";
import styles from "./styles";

// react-native-web renders `dataSet` as data-* attributes; react-native's
// types don't know about it.
const WebView = View as unknown as React.ComponentType<
  ViewProps & { dataSet?: Record<string, string> }
>;

interface SidebarLinkProps {
  label: string;
  href: "/" | "/profile";
  focused: boolean;
  icon: IconName;
  focusedIcon: IconName;
}

function SidebarLink({ label, href, focused, icon, focusedIcon }: SidebarLinkProps) {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(false);

  const color = focused ? theme.accent : theme.color;
  const backgroundColor = hovered ? theme.cardBackground : "transparent";

  return (
    <Link href={href} asChild>
      <Pressable
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        // Link's Slot rejects style arrays, so flatten.
        style={StyleSheet.flatten([styles.link, { backgroundColor }])}
      >
        <Icon name={focused ? focusedIcon : icon} size={24} color={color} />
        <ThemeText style={styles.linkLabel} text={label} color={color} />
      </Pressable>
    </Link>
  );
}

// Rendered once around the whole router stack (app/_layout.tsx), so the
// sidebar stays put while routes change in the centre column. The markup is
// the same at every width; WEB_SHELL_CSS (in app/+html.tsx) shows the
// sidebar and fixes the column width above the wide breakpoint.
function WebAppShell({ children }: Props) {
  const { theme } = useTheme();
  const pathname = usePathname();

  return (
    <View style={[styles.row, { backgroundColor: theme.screenBackground }]}>
      <WebView dataSet={{ shellSidebar: "" }} style={styles.sidebar}>
        <SidebarLink
          label="Projects"
          href="/"
          focused={pathname === "/" || pathname.startsWith("/project/")}
          icon="home-outline"
          focusedIcon="home"
        />
        <SidebarLink
          label="Profile"
          href="/profile"
          focused={pathname === "/profile"}
          icon="person-circle-outline"
          focusedIcon="person-circle"
        />
      </WebView>
      <WebView dataSet={{ shellContent: "" }} style={[styles.content, { borderColor: theme.line }]}>
        {children}
      </WebView>
    </View>
  );
}

export default WebAppShell;
