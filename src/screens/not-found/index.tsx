import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Header, PageHead, TerminalWindow } from "@/components";
import Caret from "@/components/caret";
import Enter from "@/components/enter";
import { ThemeScope, useTheme } from "@/context";
import { darkTheme } from "@/themes";
import { commonStyles } from "@/common";
import styles from "./styles";

// Terminal windows are navy in both themes; this reads the scoped theme.
function BashWindow({ raised }: { raised: boolean }) {
  const { theme } = useTheme();
  return (
    <TerminalWindow title="bash" raised={raised}>
      <Text style={[styles.code, { color: theme.text }]} accessibilityRole="header">
        404
        <Caret size="display" />
      </Text>
      <Text style={[commonStyles.prompt, styles.prompt, { color: theme.textSecondary }]}>
        <Text style={{ color: theme.accentText }}>$</Text> cd ~/this-page
      </Text>
      <Text style={[commonStyles.meta, { color: theme.textSecondary }]}>
        bash: cd: no such file or directory
      </Text>
      <Link href="/" asChild>
        <Pressable
          dataSet={{ contact: "primary" }}
          // Link's Slot rejects style arrays, so flatten.
          style={StyleSheet.flatten([styles.button, { backgroundColor: theme.accent }])}
        >
          <Text style={[commonStyles.button, { color: theme.onAccent }]}>cd ~/projects</Text>
        </Pressable>
      </Link>
    </TerminalWindow>
  );
}

function NotFound() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[commonStyles.flex, { backgroundColor: theme.screenBackground }]}>
      <PageHead title="Not found" path="/404" noIndex />
      <Header title="~/404" leftIcon="back" onLeftPress={() => router.replace("/")} />
      <View style={[commonStyles.flex, commonStyles.center, commonStyles.horizontalPadding]}>
        <View style={styles.window}>
          <Enter index={0}>
            <ThemeScope theme={darkTheme}>
              <BashWindow raised={theme.theme === "light"} />
            </ThemeScope>
          </Enter>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default NotFound;
