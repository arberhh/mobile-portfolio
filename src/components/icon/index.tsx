import React from "react";
import { StyleProp, TextStyle, View } from "react-native";
// Deep import: the package barrel would bundle every icon set's glyph map.
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHydrated } from "@/hooks";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface IconProps {
  name: IconName;
  size: number;
  color: string;
  style?: StyleProp<TextStyle>;
}

// The app's only icon component, so only the Ionicons font ships. Icon
// glyphs depend on the icon font having loaded, which differs between the
// static HTML and the client, so on web the glyph renders after hydration
// in a same-size box (no layout shift).
function Icon({ name, size, color, style }: IconProps) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return <View style={[{ width: size, height: size }, style]} />;
  }
  return <Ionicons name={name} size={size} color={color} style={style} />;
}

export default Icon;
export type { IconName };
