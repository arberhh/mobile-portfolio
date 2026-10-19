import React from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
// Deep imports: the package barrel references all 14 weights.
import { IBMPlexMono_400Regular } from "@expo-google-fonts/ibm-plex-mono/400Regular";
import { IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono/500Medium";
import { ThemeProvider } from "@/context";
import { WebAppShell } from "@/components";
import { commonStyles } from "@/common";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
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
          <WebAppShell>
            <Stack screenOptions={{ headerShown: false }} />
          </WebAppShell>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
