import React, { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { commonStyles } from "@/common";

// The slideshow's carousel needs Gesture Handler on native. Web has its own
// carousel, so it uses a plain View (index.web.tsx) and leaves the library
// out of the web bundle.
export default function GestureRoot({ children }: { children: ReactNode }) {
  return <GestureHandlerRootView style={commonStyles.flex}>{children}</GestureHandlerRootView>;
}
