import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/context";
import { useAppFonts, useSystemThemeSync } from "@/hooks";
import { WebAppShell } from "@/components";
import GestureRoot from "@/components/gesture-root";
import { commonStyles } from "@/common";

// Lives inside ThemeProvider so the OS theme sync runs whichever route a
// visitor lands on first.
function AppStack() {
  useSystemThemeSync();

  return (
    <WebAppShell>
      <Stack screenOptions={{ headerShown: false }} />
    </WebAppShell>
  );
}

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  // Always true on web, which renders straight away (the font swaps in when
  // loaded): gating it would bake only this spinner into every static page.
  if (!fontsLoaded) {
    return (
      <View style={[commonStyles.flex, commonStyles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureRoot>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppStack />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureRoot>
  );
}
