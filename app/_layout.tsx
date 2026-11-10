import React from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
// Deep imports: the package barrel references all 14 weights.
import { IBMPlexMono_400Regular } from "@expo-google-fonts/ibm-plex-mono/400Regular";
import { IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono/500Medium";
import { IBMPlexSans_400Regular } from "@expo-google-fonts/ibm-plex-sans/400Regular";
import { IBMPlexSans_500Medium } from "@expo-google-fonts/ibm-plex-sans/500Medium";
import { IBMPlexSans_600SemiBold } from "@expo-google-fonts/ibm-plex-sans/600SemiBold";
import { ThemeProvider } from "@/context";
import { useSystemThemeSync } from "@/hooks";
import { WebAppShell } from "@/components";
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
  const [fontsLoaded] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
  });

  // Web renders straight away (the font swaps in when loaded): gating it
  // would bake only this spinner into every statically rendered page.
  if (!fontsLoaded && Platform.OS !== "web") {
    return (
      <View style={[commonStyles.flex, commonStyles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={commonStyles.flex}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppStack />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
