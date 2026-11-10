import { Pressable, StyleSheet, View } from "react-native";
import { Link, usePathname } from "expo-router";
import { useTheme } from "@/context";
import { cardElevation } from "@/themes";
import { commonStyles } from "@/common";
import Caret from "../caret";
import Icon, { IconName } from "../icon";
import ThemeText from "../theme-text";
import { Props } from "@/types";
import styles from "./styles";

interface SidebarLinkProps {
  label: string;
  href: "/" | "/profile";
  focused: boolean;
  icon: IconName;
  focusedIcon: IconName;
}

// Hover is CSS (`data-nav-pill` in WEB_SHELL_CSS), so it needs no state.
function SidebarLink({ label, href, focused, icon, focusedIcon }: SidebarLinkProps) {
  const { theme } = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable
        dataSet={focused ? { navPill: "", active: "" } : { navPill: "" }}
        // Link's Slot rejects style arrays, so flatten.
        style={StyleSheet.flatten([
          styles.link,
          focused && { backgroundColor: theme.cardBackground },
          focused && cardElevation[theme.theme],
        ])}
      >
        <Icon
          name={focused ? focusedIcon : icon}
          size={22}
          color={focused ? theme.accent : theme.color}
        />
        <ThemeText style={commonStyles.nav} text={label} />
      </Pressable>
    </Link>
  );
}

// Rendered once around the whole router stack (app/_layout.tsx), so the
// sidebar stays put while routes change in the window. The markup is the
// same at every width; WEB_SHELL_CSS (in app/+html.tsx) shows the sidebar,
// the sky desktop and the floating window above the wide breakpoint.
function WebAppShell({ children }: Props) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const isLight = theme.theme === "light";

  return (
    <View
      dataSet={{ shellRoot: "", shellTheme: theme.theme }}
      style={[styles.row, { backgroundColor: theme.screenBackground }]}
    >
      <View
        role="navigation"
        aria-label="Primary"
        dataSet={isLight ? { shellSidebar: "", sky: "" } : { shellSidebar: "" }}
      >
        <View style={styles.brand}>
          <ThemeText style={styles.brandText} text="~/arber" />
          <Caret size="small" />
        </View>
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
      </View>
      <View
        role="main"
        dataSet={{ shellContent: "" }}
        style={[styles.content, { backgroundColor: theme.screenBackground }]}
      >
        {children}
      </View>
    </View>
  );
}

export default WebAppShell;
